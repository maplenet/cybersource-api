import axios from "axios";
import { qr } from "../config/env";
import { Qr } from "../entities/qr.entity";

export async function generateQr(body: any) {
  const payload = {
    numeroReferencia: body.referenceNumber,
    glosa: qr.API_GLOSA,
    monto: body.amount,
    moneda: "BOB",
    canal: "WEB",
    tiempoQr: "00:15:00",
  };
  const response = await axios.post(`${qr.API_BASE_URL}/generarQr`, payload, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": qr.API_KEY,
    },
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  const qrData = new Qr();
  qrData.amount = body.amount;
  qrData.refNumber = response.data.numeroReferencia;
  qrData.idUser = body.idUser;

  qrData.save();

  return response.data;
}

export async function verifyQr(referenceNumber: string) {
  try {
    const response = await axios.get(
      `${qr.API_BASE_URL}/verificaQr/${referenceNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": qr.API_KEY,
        },
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detalleRespuesta || "Error verificando QR"
    );
  }
}

// export async function qrConfirmed(req: any, res: any) {
//   const authHeader = req.headers.get("authorization");
//   const apiKey = req.headers.get("x-api-key");

//   if (!apiKey && authHeader !== QR_EXPECTED_BASIC_AUTH) {
//     return res.status(403).json({
//       numeroReferencia: null,
//       codigoRespuesta: "05",
//       detalleRespuesta: "Acceso no autorizado",
//     });
//   }

//   const response = await processQrConfirmation(req.body);
//   res.json(response);
// }
