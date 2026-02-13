import { requireAuth, getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma'
import { Request, Response, NextFunction } from 'express'

// Middleware to require authentication
export const clerkAuth = requireAuth()

// Middleware to sync user to database on first login
export async function syncUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const auth = getAuth(req)
        if (!auth.userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Check if user exists in database
        let user = await prisma.user.findUnique({
            where: { id: auth.userId }
        })

        // If user doesn't exist, create from Clerk data
        if (!user) {
            const email = (auth.sessionClaims as any)?.email || `user-${auth.userId}@temp.com`
            const firstName = (auth.sessionClaims as any)?.firstName

            user = await prisma.user.create({
                data: {
                    id: auth.userId,
                    email: email,
                    name: firstName || null
                }
            })
        }

        // Attach user to request
        ; (req as any).user = user
        next()
    } catch (error) {
        console.error('Error syncing user:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}