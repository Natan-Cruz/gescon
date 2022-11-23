import { Router } from "express";
import auth from "../../../midlewares/auth";

import * as controllers from "./controllers/accounting";
import * as controllersWebhooks from "./controllers/webhook"

// import "../voluti"

const router = Router();

router.get("/", auth, controllers.getAllAccounts)
router.put("/pay", auth, controllers.generatePaymentTransaction)

// digital bank functions
router.post("/generate-payments", auth, controllers.generatePayments)
router.post("/installments-customers", auth, controllers.getInformationsAboutInstallmentsAndCustomers)

router.post("/webhook/succeeded", auth, controllersWebhooks.handleSucceeded )
router.post("/webhook/canceled", auth, controllersWebhooks.handleCanceled )
router.post("/webhook/failed", auth, controllersWebhooks.handleFailed )
router.post("/webhook/updated", auth, controllersWebhooks.handleUpdated )

export { router };