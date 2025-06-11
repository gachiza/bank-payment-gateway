import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { validate } from "../middleware/validation.middleware";
import { createAccountSchema, accountDetailsScheema, depositSchema} from "../services/account.services"
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware.authenticate, validate(createAccountSchema), AccountController.createAccount);
router.get("/", authMiddleware.authenticate, AccountController.getUserAccounts);
router.get("/:accountId", authMiddleware.authenticate, validate(accountDetailsScheema), AccountController.getAccountDetails);
router.post("/deposit", authMiddleware.authenticate, validate(depositSchema), AccountController.deposit);

export default router;