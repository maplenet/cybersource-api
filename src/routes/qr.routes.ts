import { Router } from "express";
import { generateQr, verifyQr } from "../services/qr.service";
import { QrDTO } from "../dto/qr.dto";
import * as fs from "fs";
import * as path from "path";

const router = Router();

const QR_API_KEY_VALIDATION = process.env.QR_API_KEY_VALIDATION!;

const guardarSolicitud = (data: any) => {
  const filePath = path.join(__dirname, "../../solicitudes.log");
  const logData = JSON.stringify(data) + "\n";

  fs.appendFile(filePath, logData, (err) => {
    if (err) {
      console.error("Error al guardar solicitud:", err);
    }
  });
};

router.post("/generateQr", async (req, res) => {
  try {
    const data = await generateQr(req.body);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Error generando el QR",
      details: error.response?.data || null,
    });
  }
});

router.get("/verifyQr/:referenceNumber", async (req: any, res: any) => {
  const referenceNumber = req.params.referenceNumber;
  if (!referenceNumber) {
    return res.status(400).json({ error: "referenceNumber es requerido" });
  }
  try {
    const data = await verifyQr(referenceNumber);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error verificando el QR" });
  }
});

router.post("/confirmed", async (req: any, res: any) => {
  const apiKey = req.headers["api-key"];

  if (apiKey !== QR_API_KEY_VALIDATION) {
    return res.status(403).json({
      numeroReferencia: null,
      codigoRespuesta: "05",
      detalleRespuesta: "Acceso no autorizado",
    });
  }

  const { numeroReferencia, estado, transacciones }: QrDTO = req.body;
  const resp = guardarSolicitud(req.body);
  console.log(resp);
  if (!numeroReferencia || !estado || !transacciones) {
    return res.status(400).json({
      numeroReferencia: numeroReferencia || null,
      codigoRespuesta: "05",
      detalleRespuesta: "Datos inválidos en la solicitud",
    });
  }

  if (estado == "00") {
    return res.json({
      numeroReferencia,
      codigoRespuesta: "00",
      detalleRespuesta: null,
    });
  } else if (estado == "03") {
    return res.json({
      numeroReferencia,
      codigoRespuesta: "03",
      detalleRespuesta: "QR expirado",
    });
  } else if (estado == "05") {
    return res.json({
      numeroReferencia,
      codigoRespuesta: "05",
      detalleRespuesta: "QR no válido",
    });
  }

  return res.json({
    numeroReferencia,
    codigoRespuesta: "00",
    detalleRespuesta: null,
  });
});

export default router;
