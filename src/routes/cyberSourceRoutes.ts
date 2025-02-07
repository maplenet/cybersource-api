import { Router } from "express";
import {
  processPayment,
  createAuthenticationSetup,
  createAuthentication,
  getAuthenticationResult,
  // checkEnrollment,
} from "../services/cyberSourceService";

const router = Router();

router.post("/auth-setup", async (req, res) => {
  try {
    const data = await createAuthenticationSetup(req.body);
    console.log(data);
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

router.post("/auth-result", async (req, res) => {
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

// router.post("/check-enrollment", async (req, res) => {
//   try {
//     const data = await checkEnrollment(req.body);
//     res.json(data);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error verificando inscripción en 3D Secure" });
//   }
// });

export default router;
