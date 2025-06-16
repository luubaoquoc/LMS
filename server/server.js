import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from './configs/mongoose.js';
import { clerkWebhooks } from "./controllers/webhooks.js";

//initialize Express
const app = express();

//connect connectDB
connectDB();

//port
const PORT = process.env.PORT || 3001;

//middlewares
app.use(cors());

//routes
app.get('/', (req, res) => {
    res.send('hello');
})
app.post('/clerk', express.json(), clerkWebhooks)


app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})