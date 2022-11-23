import { Router } from "express";

import * as controllers from "./controllers/controllers"
import * as controllersBanner from "./controllers/banner"
import * as controllerWeatherData from "./controllers/weatherData.js";
import * as controllerMembers from "./controllers/members";
import * as controllerReports from "./controllers/reports"
import auth from "../../../midlewares/auth";
import Upload from "./uploader";

const router = Router();

// Get all constructions in currently on company
router.get("/", auth, controllers.getAllConstructions );
router.post("/", auth, controllers.createNewConstruction );
router.get("/:id/progress", auth, controllers.getProgress );
router.get("/:id/calc-space-used", auth, controllers.spaceUsedInCloud );
router.get("/:id/informations", auth, controllers.getInformations );
router.put("/", auth, controllers.updateInformations );
router.get("/:id/erp-activities", auth, controllers.getErpActivities );

router.post("/:id/banner", Upload.single('image'), controllersBanner.uploadBanner );
router.delete("/:id/banner", auth, controllersBanner.deleteBannner );

// Obtem dados metereologicos
router.get("/:id/occurrences/weather-data", auth, controllerWeatherData.getWeatherData)

// members
router.get("/:id/members", auth, controllerMembers.getAllMembersInConstruction)
router.get("/:id/non-members", auth, controllerMembers.getNonMembersInConstruction)
router.post("/members", auth, controllerMembers.addMember)
router.put("/members", auth, controllerMembers.editMember)
router.delete("/members/:id", auth, controllerMembers.removeMember)

// climate and work conditions and workforce 
router.get("/:id/reports", auth, controllerReports.getAllReports)
router.get('/:construction_id/reports/:report_id', auth, controllerReports.getOneReport )
router.post('/:id/reports', auth, controllerReports.createNewReport)
router.put('/:construction_id/reports/:report_id', auth, controllerReports.editReport )
router.delete('/:construction_id/reports/:report_id', auth, controllerReports.deleteReport );

export { router };
