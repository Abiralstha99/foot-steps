import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


// Get all photos with coordinates
async function getAllPhotos(req: Request, res: Response) {
  try {
    const photos = await prisma.photo.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } }
        ]
      },
      orderBy: {
        takenAt: 'desc'  // Most recent first
      }
    });
    
    return res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({ 
      message: "Failed to fetch photos" 
    });
  }
}

export { getAllPhotos };