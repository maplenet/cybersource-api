import axios from "axios";
import dotenv from "dotenv";
import { computeHttpSignature } from "../utils/signUtils";
import crypto from "crypto";
import { AuthenticationStatus } from "../constants/enums";
import {
  AuthenticationDTO,
  CreateAuthenticationDTO,
  GetAuthenticationResultDTO,
  ProcessPaymentDTO,
} from "../dto/cyberSource.dto";

dotenv.config();
const codeUser = "MAP0006";

const API_BASE_URL = process.env.CYBERSOURCE_API_BASE_URL!;
const MERCHANT_ID = process.env.CYBERSOURCE_MERCHANT_ID!;
const KEY_ID = process.env.CYBERSOURCE_KEY_ID!;
const SECRET_KEY = process.env.CYBERSOURCE_SECRET_KEY!;
const RETURN_URL = process.env.CYBERSOURCE_RETURN_URL!;

const QR_BASE_URL = process.env.QR_BASE_URL!;
const QR_X_API_KEY = process.env.QR_X_API_KEY!;

async function cyberSourceRequest(
  endpoint: string,
  method: "GET" | "POST",
  body?: object
) {
  const curDate = new Date().toUTCString();

  const signatureHeaders: Record<string, string> = {
    host: API_BASE_URL.replace("https://", ""),
    date: curDate,
    "(request-target)": `${method.toLowerCase()} ${endpoint}`,
    "v-c-merchant-id": MERCHANT_ID,
  };
  if (body) {
    const digest = crypto
      .createHash("sha256")
      .update(JSON.stringify(body))
      .digest("base64");
    signatureHeaders["digest"] = `SHA-256=${digest}`;
  }

  const signature = computeHttpSignature(KEY_ID, SECRET_KEY, signatureHeaders);

  const headers: Record<string, string> & { Digest?: string } = {
    Host: signatureHeaders.host,
    Date: signatureHeaders.date,
    "v-c-merchant-id": MERCHANT_ID,
    Signature: signature,
    "Content-Type": "application/json",
  };

  if (body) headers["Digest"] = signatureHeaders["digest"];

  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method,
      headers,
      data: body ? JSON.stringify(body) : undefined,
    });

    return response.data;
  } catch (error) {
    throw new Error("Error en la API de CyberSource");
  }
}

export async function createAuthenticationSetup(body: any) {
  const cardType = body.number.startsWith("4") ? "001" : "002";

  const payload: AuthenticationDTO = {
    clientReferenceInformation: { code: body.code || codeUser },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.number,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
      },
    },
  };
  const response = await cyberSourceRequest(
    "/risk/v1/authentication-setups",
    "POST",
    payload
  );
  return {
    Status: response.status,
    accessToken: response.consumerAuthenticationInformation?.accessToken,
    deviceDataCollectionUrl:
      response.consumerAuthenticationInformation.deviceDataCollectionUrl,
    referenceId: response.consumerAuthenticationInformation.referenceId,
  };
}

export async function createAuthentication(body: any) {
  const cardType = body.number.startsWith("4") ? "001" : "002";

  const payload: CreateAuthenticationDTO = {
    clientReferenceInformation: { code: body.code || codeUser },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.number,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
        securityCode: body.securityCode,
      },
    },
    orderInformation: {
      amountDetails: {
        totalAmount: body.totalAmount,
        currency: "BOB",
      },
      billTo: body.billTo,
    },
    consumerAuthenticationInformation: {
      referenceId: body.referenceId,
      returnUrl: RETURN_URL,
      transactionMode: "S",
    },
  };
  const response = await cyberSourceRequest(
    "/risk/v1/authentications",
    "POST",
    payload
  );

  return {
    Status: response.status,
    directoryServerTransactionId:
      response.consumerAuthenticationInformation
        ?.directoryServerTransactionId || "",
    specificationVersion:
      response.consumerAuthenticationInformation?.specificationVersion || "",
    ucafCollectionIndicator:
      response.consumerAuthenticationInformation?.ucafCollectionIndicator || "",
    ucafAuthenticationData:
      response.consumerAuthenticationInformation?.ucafAuthenticationData || "",
    xid: response.consumerAuthenticationInformation?.xid || "",
    cavv: response.consumerAuthenticationInformation?.cavv || "",
    accessToken: response.consumerAuthenticationInformation?.accessToken || "",
    stepUpUrl: response.consumerAuthenticationInformation?.stepUpUrl || "",
    authenticationTransactionId:
      response.consumerAuthenticationInformation?.authenticationTransactionId ||
      "",
    indicator: response.consumerAuthenticationInformation?.indicator || "",
  };
}

export async function getAuthenticationResult(body: any) {
  const cardType = body.number.startsWith("4") ? "001" : "002";
  const payload: GetAuthenticationResultDTO = {
    clientReferenceInformation: { code: body.code || codeUser },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.number,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
        securityCode: body.securityCode,
      },
    },
    orderInformation: {
      amountDetails: {
        totalAmount: body.totalAmount,
        currency: "BOB",
      },
      billTo: body.billTo,
    },
    consumerAuthenticationInformation: {
      authenticationTransactionId: body.authenticationTransactionId,
    },
  };

  const response = await cyberSourceRequest(
    "/risk/v1/authentication-results",
    "POST",
    payload
  );
  return {
    Status: response.status,
    directoryServerTransactionId:
      response.consumerAuthenticationInformation
        ?.directoryServerTransactionId || "",
    cavv: response.consumerAuthenticationInformation?.cavv || "",
    xid: response.consumerAuthenticationInformation?.xid || "",
    ucafCollectionIndicator:
      response.consumerAuthenticationInformation?.ucafCollectionIndicator || "",
    ucafAuthenticationData:
      response.consumerAuthenticationInformation?.ucafAuthenticationData || "",
    indicator: response.consumerAuthenticationInformation?.indicator || "",
  };
}

export async function processPayment(body: any) {
  const cardType = body.number.startsWith("4") ? "001" : "002";
  const isVisa = cardType === "001" ? true : false;

  const payload = {
    clientReferenceInformation: { code: body.code || codeUser },
    processingInformation: {
      capture: true,
      commerceIndicator: body.commerceIndicator,
    },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.number,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
        securityCode: body.securityCode,
      },
    },
    orderInformation: {
      amountDetails: {
        totalAmount: body.totalAmount,
        currency: "BOB",
      },
      billTo: body.billTo,
    },
    consumerAuthenticationInformation: {
      cavv: isVisa ? body.cavv : "",
      xid: isVisa ? body.xid : "",
      ucafCollectionIndicator: isVisa ? "" : body.ucafCollectionIndicator,
      ucafAuthenticationData: isVisa ? "" : body.ucafAuthenticationData,
      directoryServerTransactionId: body.directoryServerTransactionId,
      paSpecificationVersion: body.paSpecificationVersion,
    },
  };

  const response = await cyberSourceRequest(
    "/pts/v2/payments",
    "POST",
    payload
  );

  return {
    Status: response.status,
  };
}

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
