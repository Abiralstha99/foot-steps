import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

async function getTrip(req: Request, res: Response) {
  const { tripId } = req.params;
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
  });
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  return res.json(trip);
}

async function createTrip(req: Request, res: Response) {
  try {
    const { userId, name, description, startDate, endDate } = req.body;

    // Basic validation
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
  } catch (error) {
    console.error("Error creating trip:", error);
    return res.status(500).json({ message: "Failed to create trip" });
  }
}

export { getTrip, createTrip };
