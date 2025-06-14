"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_services_1 = require("../services/auth.services");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", (0, validation_middleware_1.validate)(auth_services_1.registerSchema), auth_controller_1.AuthController.register);
router.post("/login", (0, validation_middleware_1.validate)(auth_services_1.loginSchema), auth_controller_1.AuthController.login);
router.get("/profile", auth_middleware_1.authMiddleware.authenticate, auth_controller_1.AuthController.profile);
exports.default = router;
