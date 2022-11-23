import { Router } from "express";
import auth from "../../../midlewares/auth";

import * as controllers from "./controllers"

const router = Router();

router.get("/informations", auth, controllers.getPaymentsInformations);
router.get("/transaction/details/:id", auth, controllers.getTransactionDetails)

router.get("/logs", auth, controllers.getLogs)

export { router };
