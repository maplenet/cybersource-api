import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

export const cyberSource = {
  API_BASE_URL: process.env.CYBERSOURCE_API_BASE_URL!,
  MERCHANT_ID: process.env.CYBERSOURCE_MERCHANT_ID!,
  KEY_ID: process.env.CYBERSOURCE_KEY_ID!,
  SECRET_KEY: process.env.CYBERSOURCE_SECRET_KEY!,
  RETURN_URL: process.env.CYBERSOURCE_RETURN_URL!,
};

export const qr = {
  API_BASE_URL: process.env.QR_BASE_URL!,
  API_KEY: process.env.QR_X_API_KEY!,
  API_GLOSA: process.env.QR_GLOSA!,
};
