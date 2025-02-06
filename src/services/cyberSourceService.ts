import axios from "axios";
import dotenv from "dotenv";
import { computeHttpSignature } from "../utils/signUtils";
import crypto from "crypto";
import { AuthenticationStatus } from "../constants/enums";

dotenv.config();
const codeUser = "MAP0006";

const API_BASE_URL = process.env.CYBERSOURCE_API_BASE_URL!;
const MERCHANT_ID = process.env.CYBERSOURCE_MERCHANT_ID!;
const KEY_ID = process.env.CYBERSOURCE_KEY_ID!;
const SECRET_KEY = process.env.CYBERSOURCE_SECRET_KEY!;

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
    console.error("CyberSource API error:", error);
    throw new Error("Error en la API de CyberSource");
  }
}

// export async function processPayment(body: object) {
//   return cyberSourceRequest("/pts/v2/payments", "POST", body);
// }

export async function processPayment(body: any) {
  const isVisa = body.cardType === "001";
  const typeCard = isVisa ? "001" : "002";

  const payload = {
    clientReferenceInformation: { code: codeUser },
    processingInformation: {
      capture: true,
      commerceIndicator: "vbv",
    },
    paymentInformation: {
      card: {
        type: typeCard,
        number: body.cardNumber,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
        securityCode: body.securityCode,
      },
    },
    orderInformation: {
      amountDetails: {
        totalAmount: body.totalAmount,
        currency: "USD",
      },
      billTo: body.billTo,
    },
    consumerAuthenticationInformation: {
      cavv: isVisa ? body.cavv : "",
      xid: isVisa ? body.xid : "",
      ucafCollectionIndicator: isVisa ? "" : body.ucafCollectionIndicator,
      ucafAuthenticationData: isVisa ? "" : body.ucafAuthenticationData,
      directoryServerTransactionId: body.directoryServerTransactionId,
      paSpecificationVersion: "2.1.0",
    },
  };

  return cyberSourceRequest("/pts/v2/payments", "POST", payload);
}

// export async function createAuthenticationSetup(body: object) {
//   return cyberSourceRequest("/risk/v1/authentication-setups", "POST", body);
// }

export async function createAuthenticationSetup(body: any) {
  const cardType = body.cardNumber.startsWith("4") ? "001" : "002";

  const payload = {
    clientReferenceInformation: { code: codeUser },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.cardNumber,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
      },
    },
  };
  return cyberSourceRequest("/risk/v1/authentication-setups", "POST", payload);
}

// export async function createAuthentication(body: object) {
//   return cyberSourceRequest("/risk/v1/authentications", "POST", body);
// }

export async function createAuthentication(body: any) {
  const cardType = body.cardNumber.startsWith("4") ? "001" : "002";

  const payload = {
    clientReferenceInformation: { code: codeUser },
    orderInformation: {
      amountDetails: {
        totalAmount: body.totalAmount,
        currency: "BOB",
      },
      billTo: body.billTo,
    },
    paymentInformation: {
      card: {
        type: cardType,
        number: body.cardNumber,
        expirationMonth: body.expirationMonth,
        expirationYear: body.expirationYear,
        securityCode: body.securityCode,
      },
    },
    consumerAuthenticationInformation: {
      referenceId: body.referenceId,
      returnUrl: "https://www.google.com",
      transactionMode: "S",
    },
  };

  const response = await cyberSourceRequest(
    "/risk/v1/authentications",
    "POST",
    payload
  );

  if (
    response.consumerAuthenticationInformation?.status ===
    "AUTHENTICATION_SUCCESSFUL"
  ) {
    return {
      proceedToPayment: true,
      authenticationTransactionId:
        response.consumerAuthenticationInformation.authenticationTransactionId,
    };
  }

  return response;
}

// export async function getAuthenticationResult(body: object) {
//   return cyberSourceRequest("/risk/v1/authentication-results", "POST", body);
// }

export async function getAuthenticationResult(body: any) {
  const payload = {
    clientReferenceInformation: { code: codeUser },
    consumerAuthenticationInformation: {
      authenticationTransactionId: body.authenticationTransactionId,
    },
  };
  return cyberSourceRequest("/risk/v1/authentication-results", "POST", payload);
}

export async function checkEnrollment(body: object) {
  return cyberSourceRequest("/risk/v1/authentications", "POST", body);
}
