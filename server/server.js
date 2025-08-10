import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './configs/mongoose.js';
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

//initialize Express
const app = express();

//connect connectDB
await connectDB();
await connectCloudinary()

//port
const PORT = process.env.PORT || 3001;

//middlewares
app.use(cors());
app.use(clerkMiddleware());

//routes
app.get('/', (req, res) => {
    res.send('hello');
})
app.post('/clerk', express.json(), clerkWebhooks);
//import educator routes
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)




app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})