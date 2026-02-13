import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getPresignedUrl } from "../services/s3.service";


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

    const photosWithFreshUrls = await Promise.all(
      photos.map(async (photo) => {
        const viewUrl = await getPresignedUrl(photo.s3Key);
        return {
          ...photo,
          viewUrl,
        };
      }),
    );
    return res.json(photosWithFreshUrls);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({ 
      message: "Failed to fetch photos" 
    });
  }
}

export { getAllPhotos };