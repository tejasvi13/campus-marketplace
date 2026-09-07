import { Request, Response } from "express";

import { IUser } from "../models/User";
import Listing from "../models/Listing";

export interface ProfileResponse {
  id: string;
  name: string;
  regNo: string;
  email: string;
  department: string;
  year: string;
  phone: string;
  hostel: string;
  about: string;
  isVerified: boolean;
  joinedAt: Date;
}

function toProfile(user: IUser): ProfileResponse {
  return {
    id: String(user._id),
    name: user.name,
    regNo: user.regNo,
    email: user.email,
    department: user.department,
    year: user.year,
    phone: user.phone,
    hostel: user.hostel,
    about: user.about,
    isVerified: user.isVerified,
    joinedAt: user.createdAt,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// GET /api/users/me
export async function getMyProfile(req: Request, res: Response): Promise<Response> {
  try {
    const user: IUser = req.currentUser!;

    const listingCount: number = await Listing.countDocuments({ owner: user._id });

    return res.status(200).json({ profile: toProfile(user), listingCount });
  } catch (error: unknown) {
    console.error("getMyProfile error:", errorMessage(error));
    return res.status(500).json({ message: "Could not load your profile." });
  }
}

interface ProfileBody {
  name?: string;
  department?: string;
  year?: string;
  phone?: string;
  hostel?: string;
  about?: string;
}

export async function updateMyProfile(req: Request, res: Response): Promise<Response> {
  try {
    const user: IUser = req.currentUser!;
    const body: ProfileBody = req.body;

    const name: string = String(body.name || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Your name cannot be empty." });
    }

    user.name = name;
    user.department = String(body.department || "").trim();
    user.year = String(body.year || "").trim();
    user.phone = String(body.phone || "").trim();
    user.hostel = String(body.hostel || "").trim();
    user.about = String(body.about || "").trim();

    await user.save();

    return res.status(200).json({ message: "Profile saved.", profile: toProfile(user) });
  } catch (error: unknown) {
    console.error("updateMyProfile error:", errorMessage(error));
    return res.status(500).json({ message: "Could not save your profile." });
  }
}
