import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { getPresignedUrl } from "../services/s3.service";

async function getTrip(req: Request, res: Response) {
  const userId = req.auth().userId;
  const trips = await prisma.trip.findMany({ where: { userId } });

  // `coverPhotoUrl` may be either a real URL (legacy/manual) or an S3 key.
  // When it's an S3 key, return a fresh signed URL via `coverViewUrl`.
  const tripsWithCover = await Promise.all(
    trips.map(async (trip) => {
      const cover = trip.coverPhotoUrl;
      if (!cover) return { ...trip, coverViewUrl: null };
      if (/^https?:\/\//i.test(cover)) return { ...trip, coverViewUrl: cover };
      const coverViewUrl = await getPresignedUrl(cover);
      return { ...trip, coverViewUrl };
    }),
  );

  return res.json(tripsWithCover);
}

async function createTrip(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;

    //Basic validation
    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields: name, startDate, endDate",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(coverPhotoUrl != null && coverPhotoUrl !== "" && { coverPhotoUrl }),
      },
    });
    return res.status(201).json(trip);
  } catch (error: any) {
    console.error("Error creating trip:", error);

    // Check for specific Prisma errors
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: "Invalid userId: User does not exist",
        error: error.meta?.field_name
      });
    }

    return res.status(500).json({
      message: "Failed to create trip",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Generate new preSignedURL 
async function getTripById(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { id } = req.params;
    const prismaTrip = await prisma.trip.findUnique({
      where: { id },
      include: { photos: true },
    });
    if (!prismaTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (prismaTrip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Generate fresh presigned URLs using stored s3Key (do not persist presigned URLs)
    const photosWithFreshUrls = await Promise.all(
      prismaTrip.photos.map(async (photo) => {
        const viewUrl = await getPresignedUrl(photo.s3Key);
        return {
          ...photo,
          viewUrl,
        };
      }),
    );

    const cover = prismaTrip.coverPhotoUrl;
    const coverViewUrl =
      !cover ? null : /^https?:\/\//i.test(cover) ? cover : await getPresignedUrl(cover);

    const tripWithFreshUrls = {
      ...prismaTrip,
      coverViewUrl,
      photos: photosWithFreshUrls,
    };

    return res.json(tripWithFreshUrls);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return res.status(500).json({ message: "Failed to fetch trip" });
  }
};

async function updateTripById(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { id } = req.params;
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (existingTrip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (coverPhotoUrl !== undefined) updateData.coverPhotoUrl = coverPhotoUrl;

    const trip = await prisma.trip.update({
      where: { id },
      data: updateData,
    });

    return res.json(trip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return res.status(500).json({ message: "Failed to update trip" });
  }
}

async function deleteTripById(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { id } = req.params;

    // Check if trip exists first
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (existingTrip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete the trip (use delete() for single record by unique field)
    await prisma.trip.delete({
      where: { id },
    });

    return res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error("Error deleting trip:", error);
    return res.status(500).json({ message: "Failed to delete trip" });
  }
}

export { getTrip, createTrip, getTripById, updateTripById, deleteTripById };
