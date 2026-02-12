import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function getUserId(req: Request): string | null {
  const fromAuth = (req as any).user?.id;
  if (typeof fromAuth === "string" && fromAuth) return fromAuth;

  const fromQuery = (req.query as any)?.userId;
  if (typeof fromQuery === "string" && fromQuery) return fromQuery;

  const fromBody = (req.body as any)?.userId;
  if (typeof fromBody === "string" && fromBody) return fromBody;

  return null;
}

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const totalTrips = await prisma.trip.count({
      where: { userId },
    });

    const totalPhotos = await prisma.photo.count({
      where: {
        trip: {
          userId,
        },
      },
    });

    const trips = await prisma.trip.findMany({
      where: {
        userId,
        description: { not: null },
      },
      select: { description: true },
      distinct: ["description"],
    });

    res.json({
      totalTrips,
      totalPhotos,
      totalLocations: trips.length,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

export const getOnThisDay = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();

    const photos = await prisma.photo.findMany({
      where: {
        trip: {
          userId,
        },
        takenAt: { not: null },
      },
      include: {
        trip: {
          select: {
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        takenAt: "desc",
      },
    });

    const matchingPhoto = photos.find((photo) => {
      if (!photo.takenAt) return false;
      const photoDate = new Date(photo.takenAt);
      return (
        photoDate.getMonth() + 1 === currentMonth &&
        photoDate.getDate() === currentDay &&
        photoDate.getFullYear() !== currentYear
      );
    });

    if (matchingPhoto) {
      const yearsAgo =
        currentYear - new Date(matchingPhoto.takenAt!).getFullYear();

      res.json({
        photo: {
          id: matchingPhoto.id,
          url: matchingPhoto.url,
          takenAt: matchingPhoto.takenAt,
          tripName: matchingPhoto.trip.name,
          tripLocation: matchingPhoto.trip.description,
        },
        yearsAgo,
        message: `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago today, you were in ${matchingPhoto.trip.description || "an adventure"}`,
      });
    } else {
      const randomPhoto = await prisma.photo.findFirst({
        where: {
          trip: {
            userId,
          },
        },
        include: {
          trip: {
            select: {
              name: true,
              description: true,
            },
          },
        },
        orderBy: {
          takenAt: "desc",
        },
      });

      if (randomPhoto) {
        res.json({
          photo: {
            id: randomPhoto.id,
            url: randomPhoto.url,
            takenAt: randomPhoto.takenAt,
            tripName: randomPhoto.trip.name,
            tripLocation: randomPhoto.trip.description,
          },
          isRandom: true,
          message: "A random memory from your travels",
        });
      } else {
        res.json({
          photo: null,
          message: "No memories yet. Start your first trip!",
        });
      }
    }
  } catch (error) {
    console.error("Error fetching on-this-day photo:", error);
    res.status(500).json({ error: "Failed to fetch memory" });
  }
};

export const getUpcomingTrips = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const today = new Date();

    const upcomingTrips = await prisma.trip.findMany({
      where: {
        userId,
        startDate: {
          gt: today,
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 3,
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
      },
    });

    const tripsWithCountdown = upcomingTrips.map((trip) => {
      const daysUntil = Math.ceil(
        (new Date(trip.startDate).getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return {
        id: trip.id,
        name: trip.name,
        location: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        daysUntil,
      };
    });

    res.json(tripsWithCountdown);
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    res.status(500).json({ error: "Failed to fetch upcoming trips" });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Approximate "last modified" using recent photo uploads since Trip has no updatedAt field.
    const recentPhotos = await prisma.photo.findMany({
      where: {
        trip: { userId },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        trip: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            coverPhotoUrl: true,
            createdAt: true,
          },
        },
      },
    });

    const byTripId = new Map<string, { trip: any; lastActivityAt: Date }>();
    for (const photo of recentPhotos) {
      if (!byTripId.has(photo.tripId)) {
        byTripId.set(photo.tripId, { trip: photo.trip, lastActivityAt: photo.createdAt });
      }
      if (byTripId.size >= 3) break;
    }

    // Fallback if no photos yet: use most recently created trips.
    if (byTripId.size === 0) {
      const recentTrips = await prisma.trip.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          coverPhotoUrl: true,
          createdAt: true,
        },
      });

      return res.json(
        recentTrips.map((trip) => ({
          trip,
          lastActivityAt: trip.createdAt,
          message: `Continue editing ${trip.name}`,
        })),
      );
    }

    return res.json(
      Array.from(byTripId.values()).map(({ trip, lastActivityAt }) => ({
        trip: {
          ...trip,
          location: trip.description,
        },
        lastActivityAt,
        message: `Continue editing ${trip.name}`,
      })),
    );
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
};
