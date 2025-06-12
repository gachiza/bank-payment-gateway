import { Router } from "express";
import { PaymentController} from "../controllers/payment.controller";
import { validate } from "../middleware/validation.middleware";
import { processPaymentSchema, paymentDetailsSchema } from "../services/payment.services";
import  authMiddleware  from "../middleware/auth.middleware";

const router = Router();

router.post("/process", authMiddleware.authenticate, validate(processPaymentSchema), PaymentController.processPayment);
router.get("/:paymentReference", authMiddleware.authenticate, validate(paymentDetailsSchema), PaymentController.processPayment);

export default router;