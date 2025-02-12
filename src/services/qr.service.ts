import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const QR_BASE_URL = process.env.QR_BASE_URL!;
const QR_X_API_KEY = process.env.QR_X_API_KEY!;

export async function generateQr(body: any) {
  const payload = {
    numeroReferencia: body.referenceNumber,
    glosa: "453030|M+APIQR|7900|cobro servicio m+",
    monto: body.amount,
    moneda: "BOB",
    canal: "WEB",
    tiempoQr: "00:15:00",
  };
  const response = await axios.post(`${QR_BASE_URL}/generarQr`, payload, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": QR_X_API_KEY,
    },
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  return response.data;
}

export async function verifyQr(referenceNumber: string) {
  try {
    const response = await axios.get(
      `${QR_BASE_URL}/verificaQr/${referenceNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": QR_X_API_KEY,
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
