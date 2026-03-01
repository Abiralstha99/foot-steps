import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { getPresignedUrl } from "../services/s3.service";
import { Photo, DayGroup } from "../types/types";

async function getTrip(req: Request, res: Response) {
  try {
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
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({ message: "Failed to fetch trips" });
  }
}

async function createTrip(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;

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
    const id = req.params.id as string;
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
    const { id } = req.params as { id: string };
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      include: { photos: true }
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (existingTrip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const nextStartDate = startDate !== undefined ? new Date(startDate) : existingTrip.startDate;
    const nextEndDate = endDate !== undefined ? new Date(endDate) : existingTrip.endDate;
    if (nextStartDate.getTime() > nextEndDate.getTime()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: {
          body: {
            endDate: { _errors: ["startDate must be on or before endDate"] },
          },
        },
      });
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
    const id = req.params.id as string;

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

function groupPhotosByDay(photos: Photo[]): DayGroup[] {
  const dated = photos.filter((p) => p.takenAt != null);
  const undated = photos.filter((p) => p.takenAt == null);

  // Sort dated photos ascending by takenAt
  dated.sort((a, b) => {
    return new Date(a.takenAt!).getTime() - new Date(b.takenAt!).getTime();
  });

  // Group into ordered map keyed by YYYY-MM-DD (sliced directly from ISO string)
  const grouped = new Map<string, Photo[]>();
  for (const photo of dated) {
    const key = photo.takenAt!.slice(0, 10);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(photo);
  }

  const result: DayGroup[] = Array.from(grouped.entries()).map(([label, groupedPhotos]) => ({
    label,
    photos: groupedPhotos,
  }));

  if (undated.length > 0) {
    result.push({ label: "Unknown Date", photos: undated });
  }

  return result;
}

/**
 * Groups photos by calendar day (YYYY-MM-DD from takenAt), sorted ascending.
 * Photos with no takenAt are appended as a final "Unknown Date" group.
 * Pure function — no side effects.
 */
async function getPhotosByGrouped(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const { id: tripId } = req.params as { id: string };

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId }, // ownership check
      include: { photos: true },
    });

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const photos: Photo[] = await Promise.all(
      trip.photos.map(async (p) => ({
        ...p,
        takenAt: p.takenAt ? p.takenAt.toISOString() : null,
        createdAt: p.createdAt.toISOString(), // convert Date -> string
        viewUrl: await getPresignedUrl(p.s3Key),
      }))
    );

    const result: DayGroup[] = groupPhotosByDay(photos);

    return res.json(result)
  } catch (error) {
    console.error("Error grouping photos:", error);
    return res.status(500).json({ message: "Failed to group photos" });
  }
}


export { getTrip, createTrip, getTripById, updateTripById, deleteTripById, getPhotosByGrouped, groupPhotosByDay };
