import dotenv from "dotenv";
import cyberSourceRoutes from "./src/routes/cyberSource.routes";
import express from "express";
import cors from "cors";
import qrRoutes from "./src/routes/qr.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", cyberSourceRoutes);
app.use("/qr", qrRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
