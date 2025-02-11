import { Router } from "express";
import {
  processPayment,
  createAuthenticationSetup,
  createAuthentication,
  getAuthenticationResult,
  generateQr,
  verifyQr,
} from "../services/cyberSource.service";

const router = Router();

router.post("/authSetup", async (req, res) => {
  try {
    const data = await createAuthenticationSetup(req.body);
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error en la configuración de autenticación" });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const data = await createAuthentication(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error en la autenticación" });
  }
});

router.post("/authResult", async (req, res) => {
  try {
    const data = await getAuthenticationResult(req.body);
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error obteniendo el resultado de autenticación" });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const data = await processPayment(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error procesando el pago" });
  }
});

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

const QR_EXPECTED_BASIC_AUTH = process.env.QR_EXPECTED_BASIC_AUTH!;

router.post("/qr/confirmed", async (req: any, res: any) => {
  const authHeader = req.headers["authorization"];
  const apiKey = req.headers["x-api-key"];

  if (!apiKey && authHeader !== QR_EXPECTED_BASIC_AUTH) {
    return res.status(403).json({
      numeroReferencia: null,
      codigoRespuesta: "05",
      detalleRespuesta: "Acceso no autorizado",
    });
  }

  const { numeroReferencia, estado, transacciones } = req.body;

  if (!numeroReferencia || !estado || !transacciones) {
    return res.status(400).json({
      numeroReferencia: numeroReferencia || null,
      codigoRespuesta: "05",
      detalleRespuesta: "Datos inválidos en la solicitud",
    });
  }

  return res.json({
    numeroReferencia,
    codigoRespuesta: "00",
    detalleRespuesta: null,
  });
});

export default router;
