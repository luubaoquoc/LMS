import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './configs/mongoose.js';
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

//initialize Express
const app = express();

//connect DB & Cloudinary
await connectDB();
await connectCloudinary();

//port
const PORT = process.env.PORT || 3001;

//middlewares chung
app.use(cors());
app.use(express.json()); // parse JSON cho tất cả request

// 👇 Webhook route - KHÔNG có clerkMiddleware
app.post('/clerk', clerkWebhooks);

// Routes public
app.get('/', (req, res) => {
    res.send('hello');
})

// 👇 Chỉ áp dụng clerkMiddleware cho những route cần bảo vệ
app.use("/api/educator", clerkMiddleware(), educatorRouter);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
