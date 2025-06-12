"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const payment_services_1 = require("../services/payment.services");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/process", auth_middleware_1.default.authenticate, (0, validation_middleware_1.validate)(payment_services_1.processPaymentSchema), payment_controller_1.PaymentController.processPayment);
router.get("/:paymentReference", auth_middleware_1.default.authenticate, (0, validation_middleware_1.validate)(payment_services_1.paymentDetailsSchema), payment_controller_1.PaymentController.processPayment);
exports.default = router;
