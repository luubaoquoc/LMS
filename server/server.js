import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './configs/mongoose.js';
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";

//initialize Express
const app = express();

//connect connectDB
connectDB();

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


app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})