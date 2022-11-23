import { Router } from "express";
import auth from "../../../midlewares/auth"
import * as controller from "./controller"
import * as getAllContracts from "./controllers/contracts"

const router = Router();

router.get("/contracts", auth, getAllContracts.getAllContracts)

router.get("/contracts/:id/installments", auth, controller.getInstallemnts)
router.get("/installment", auth, controller.getOneInstallment)

export { router };
