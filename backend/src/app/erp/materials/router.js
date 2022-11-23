import { Router } from "express";
const router = Router();

import auth from "../../../midlewares/auth"
import * as controllers from "./controllers/materials.js"
import * as controllersMaterialOrders from "./controllers/materialOrders.js"
import * as controllersMaterialQuotations from "./controllers/materialQuotations.js"

// materials
router.get("/m/", auth, controllers.getAllMaterials)
router.get("/m/:id", auth, controllers.getOneMaterial)
router.post("/m", auth, controllers.createMaterial)
router.put("/m", auth, controllers.editMaterial)
router.delete("/m/:id", auth, controllers.deleteMaterial)

// purchased materials
router.get("/material-orders", auth, controllersMaterialOrders.getAllMaterialOrders)
router.get("/material-orders/:id", auth, controllersMaterialOrders.getOneMaterial)
router.post("/material-orders", auth, controllersMaterialOrders.createNewMaterialOrder)
router.put("/material-orders", auth, controllersMaterialOrders.editMaterial)
router.delete("/material-orders/:id", auth, controllersMaterialOrders.deleteMaterial)

router.get("/receive-material-order/:id", auth, controllersMaterialOrders.getMaterialOrderForReceive)
router.post("/receive-material-order", auth, controllersMaterialOrders.receiveMaterial)


router.get("/material-quotations", auth, controllersMaterialQuotations.getAllMaterialQuotations)
router.get("/material-quotations/:id", auth, controllersMaterialQuotations.getOneMaterialQuotation)
router.get("/material-quotations/:id/show", auth, controllersMaterialQuotations.getOneMaterialQuotationShow)
router.post("/material-quotations", auth, controllersMaterialQuotations.createNewMaterialQuotation)
router.put("/material-quotations", auth, controllersMaterialQuotations.editMaterial)

// public
router.get("/material-quotations/:id/public", controllersMaterialQuotations.getOneMaterialQuotationPublic)
router.post("/material-quotations/public", controllersMaterialQuotations.saveAlterationsQuotationPublic)
// router.delete("/material-quotations/:id", auth, controllersMaterialQuotations.deleteMaterial)

export { router };