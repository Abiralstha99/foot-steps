import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { uploadFile, getPresignedUrl } from "../services/s3.service";

async function getTrip(req: Request, res: Response) {
  const trips = await prisma.trip.findMany({});
  return res.json(trips);
}

async function createTrip(req: Request, res: Response) {
  try {
    const { userId, name, description, startDate, endDate } = req.body;

    //Basic validation
    if (!userId || !name || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields: userId, name, startDate, endDate",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        userId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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


async function getTripById(req: Request, res: Response) {
  const { id } = req.params;
  const prismaTrip = await prisma.trip.findUnique({
    where: { id },
    include: { photos: true },
  });
  if (!prismaTrip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  return res.json(prismaTrip);
};

async function updateTripById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, coverPhotoUrl } = req.body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
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
    const { id } = req.params;

    // Check if trip exists first
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return res.status(404).json({ message: "Trip not found" });
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

async function createPhoto(req: Request, res: Response) {
  if (!req.file) {
    const contentType = req.headers["content-type"] || "";
    return res.status(400).json({
      message: "No file uploaded",
      hint: "Use form-data with key 'photo' and type File. Content-Type received: " + contentType,
    });
  }

  const file = req.file;
  const tripId = req.params.tripId;
  if (!tripId) {
    return res.status(404).json({ message: "No tripId found" });
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return res.status(404).json({ message: "Trip not found" });

  const photoId = crypto.randomUUID();
  const key = await uploadFile(
    file.buffer,
    file.mimetype,
    trip.userId,
    tripId,
    photoId,
    file.originalname
  );
  const url = await getPresignedUrl(key);

  const photo = await prisma.photo.create({
    data: {
      id: photoId,
      tripId,
      url,
      aiTags: [],
    },
  });

  return res.status(201).json(photo);
}
export { getTrip, createTrip, getTripById, updateTripById, deleteTripById, createPhoto };
