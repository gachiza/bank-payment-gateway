import { Router } from "express";
import { PaymentController} from "../controllers/payment.controller";
import  {authMiddleware}  from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { processPaymentSchema, paymentDetailsSchema } from "../services/payment.services";


const router = Router();

router.post("/process", authMiddleware.authenticate, validate(processPaymentSchema), PaymentController.processPayment);
router.get("/:paymentReference", authMiddleware.authenticate, validate(paymentDetailsSchema), PaymentController.getPaymentDetails);

export default router;