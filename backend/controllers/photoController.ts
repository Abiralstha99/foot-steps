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

export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { photoId } = req.params;
    const { caption } = req.body;
    const userId = req.auth().userId;

    if (!photoId) {
      return res.status(400).json({ message: "Photo Id is required" });
    }

    // find the photo, it's parent trip and userid
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        trip: {
          select: { userId: true },
        },
      },
    });

    if (!photo) {
      res.status(404).json({ message: "Photo not found" });
    }

    if (photo.trip.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not own this photo" });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        caption: caption, // Update the caption
      },
    });
    return res.status(200).json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo:", error);
    return res.status(500).json({ message: "Failed to update photo" });
  }
};
