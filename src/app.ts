import cyberSourceRoutes from "./routes/cyberSource.routes";
import express from "express";
import cors from "cors";
import qrRoutes from "./routes/qr.routes";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api", cyberSourceRoutes);
app.use("/qr", qrRoutes);

export default app;
