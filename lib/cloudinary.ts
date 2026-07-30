import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Shared Cloudinary account also hosts other client projects (mapcan, UTBC) —
// scope every upload from this app under one folder so assets stay organized
// and never collide with theirs.
export const CLOUDINARY_FOLDER = "highlife-express/products";

export { cloudinary };
