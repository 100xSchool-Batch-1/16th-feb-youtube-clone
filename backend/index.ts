import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod/v4";
import { prisma } from "./db";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl, S3RequestPresigner } from "@aws-sdk/s3-request-presigner";

const R2_URL = "https://e21220f4758c0870ba9c388712d42ef2.r2.cloudflarestorage.com";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_ACCESS_SECRET = process.env.R2_ACCESS_SECRET!;

const S3 = new S3Client({
  region: "auto", // Required by SDK but not used by R2
  // Provide your Cloudflare account ID
  endpoint: R2_URL,
  // Retrieve your S3 API credentials for your R2 bucket via API tokens (see: https://developers.cloudflare.com/r2/api/tokens)
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_ACCESS_SECRET,
  },
});

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Bearer adklasdkladsklasdkldaskladkslkadslkaldsadkskl
function getUserId(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

// --- Validation schemas ---

const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  gender: z.enum(["Male", "Female", "Other"]),
  channelName: z.string().min(1),
});

const signinSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const uploadSchema = z.object({
  videoUrl: z.url(),
  thumbnail: z.url(),
});

// --- Auth ---

app.post("/api/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { username, password, gender, channelName } = parsed.data;

  const existing = await prisma.user.findFirst({ where: { username } });
  if (existing) { res.status(409).json({ error: "Username already taken" }); return; }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword, gender, channelName },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.status(201).json({ token, userId: user.id });
});

app.post("/api/signin", async (req, res) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { username, password } = parsed.data;

  const user = await prisma.user.findFirst({ where: { username } });
  if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token, userId: user.id });
});

// --- Videos ---

app.get("/api/videos", async (_req, res) => {
  const videos = await prisma.uploads.findMany({
    include: { user: { select: { id: true, channelName: true, profilePicture: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(videos);
});

app.get("/api/videos/:id", async (req, res) => {
  const video = await prisma.uploads.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, channelName: true, profilePicture: true, subscriberCount: true } } },
  });
  if (!video) { res.status(404).json({ error: "Video not found" }); return; }
  res.json(video);
});

app.post("/api/videos", async (req, res) => {
  const userId = getUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const video = await prisma.uploads.create({
    data: { ...parsed.data, userId },
  });
  res.status(201).json(video);
});


app.post("/getPresignedUrl", async (req, res) => {

  const videoPath = "videos/" + Math.random() + ".mp4"; // /videos/random/images/0.123123123123.mp4
  
  const putUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: "youtube-100xdevs",
      Key: videoPath,
      ContentType: "video/mp4",
    }),
    { expiresIn: 3600 },
  );

  res.json({
    putUrl,
    finalVideoUrl: "https://pub-9ed79a211b484b3f819c6f0883e7ac3e.r2.dev/" + videoPath
  })

})


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
