import dotenv from "dotenv";
import cyberSourceRoutes from "./src/routes/cyberSourceRoutes";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", cyberSourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
