import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getPresignedUrl, uploadFile } from "../services/s3.service";
import { upload } from "../lib/multer";
import exifr from "exifr";


// Get all photos with coordinates
async function getAllPhotos(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const photos = await prisma.photo.findMany({
      where: {
        AND: [
          {
            trip: {
              userId,
            },
          },
          { latitude: { not: null } },
          { longitude: { not: null } },
        ],
      },
      orderBy: {
        takenAt: "desc",
      },
    });

    const photosWithDisplayUrls = await Promise.all(
      photos.map(async (photo) => {
        const url = await getPresignedUrl(photo.s3Key);
        const { s3Key: _, ...rest } = photo;
        return { ...rest, url };
      }),
    );

    return res.json(photosWithDisplayUrls);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({
      message: "Failed to fetch photos",
    });
  }
}

export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const photoId = req.params.photoId as string;
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
      return res.status(404).json({ message: "Photo not found" });
    }

    if (photo.trip.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not own this photo" });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: { caption: caption ?? null },
    });
    const url = await getPresignedUrl(updatedPhoto.s3Key);
    const { s3Key: _, ...rest } = updatedPhoto;
    return res.status(200).json({ ...rest, url });
  } catch (error) {
    console.error("Error updating photo:", error);
    return res.status(500).json({ message: "Failed to update photo" });
  }
};

async function getPhotoById(req: Request, res: Response) {
  try {
    const userId = req.auth().userId;
    const photoId = req.params.photoId as string;
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        trip: {
          select: { userId: true },
        },
      },
    });
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }
    if (photo.trip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const url = await getPresignedUrl(photo.s3Key);
    const { trip, s3Key: _, ...photoWithoutTrip } = photo;
    return res.json({ ...photoWithoutTrip, url });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return res.status(500).json({ message: "Failed to fetch photo" });
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
  const tripId = req.params.tripId as string;

  let takenAt: Date | null = null;
  let latitude: number | null = null;
  let longitude: number | null = null;

  try {
    const exif = await exifr.parse(file.buffer);
    if (exif) {
      if (exif.DateTimeOriginal) {
        const d = new Date(exif.DateTimeOriginal);
        if (!Number.isNaN(d.getTime())) takenAt = d;
      }
      if (exif.latitude != null && !Number.isNaN(Number(exif.latitude))) {
        latitude = Number(exif.latitude);
      }
      if (exif.longitude != null && !Number.isNaN(Number(exif.longitude))) {
        longitude = Number(exif.longitude);
      }
    }
  } catch (err) {
    console.error("EXIF parsing failed, continuing without metadata:", err);
  }

  if (!tripId) {
    return res.status(404).json({ message: "No tripId found" });
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return res.status(404).json({ message: "Trip not found" });
  if (trip.userId !== req.auth().userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const photoId = crypto.randomUUID();
  const key = await uploadFile(
    file.buffer,
    file.mimetype,
    trip.userId,
    tripId,
    photoId,
    file.originalname,
  );

  const photo = await prisma.photo.create({
    data: {
      id: photoId,
      tripId,
      s3Key: key,
      takenAt,
      latitude,
      longitude,
      aiTags: [],
    },
  });

  const url = await getPresignedUrl(key);
  const { s3Key: _, ...photoWithoutKey } = photo;
  return res.status(201).json({ ...photoWithoutKey, url });
}

async function handlePhotoUpload(req: Request, res: Response, next: NextFunction) {
  upload.single("photo")(req, res, (err: Error | null) => {
    if (err) {
      return res.status(400).json({
        message: "Upload failed",
        error: err.message,
      });
    }
    next();
  });
}

async function deletePhoto(req: Request, res: Response) {
  try {
    const photoId = req.params.photoId as string;
    const userId = req.auth().userId;

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { trip: { select: { userId: true } } },
    });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }
    if (photo.trip.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.photo.delete({ where: { id: photoId } });
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting photo:", error);
    return res.status(500).json({ message: "Failed to delete photo" });
  }
}

export { getAllPhotos, getPhotoById, createPhoto, handlePhotoUpload, deletePhoto, updatePhoto };
