import { Router } from "express";
import auth from "../../../midlewares/auth";
import * as controllerEntity from "./controllers/entity"
import * as controllerContract from "./controllers/contracts"
import * as controllersAssets from "./controllers/assets"
import * as controllersEquipment from "./controllers/equipments"
import * as controllersEmployees from "./controllers/employees"
import * as controllersVisits from "./controllers/visits"

const router = Router();

// Cria todos as entidades
router.get(["/clients", "/material-provider", "/service-provider", "/all"], auth, controllerEntity.getAllEntities);
router.get("/entities/:id", auth, controllerEntity.getOneEntity)
router.get("/entities-contacts", auth, controllerEntity.getAllEntitiesContacts)
router.post("/entities", auth, controllerEntity.createNewEntity)
router.put("/entities/", auth, controllerEntity.editEntity)
router.delete("/entities/:id", auth, controllerEntity.deleteEntity)

// Contracts
router.get("/contracts", auth, controllerContract.getAllContracts)
router.get("/contracts/:id", auth, controllerContract.getOneContract)
router.get("/contracts/:id/show", auth, controllerContract.getOneContractResumeShows)
router.post("/contracts", auth, controllerContract.createNewContract)
router.put("/contracts", auth, controllerContract.editContract)
// contracts actions
router.post("/contracts/actions", auth, controllerContract.contractActions)

router.get("/assets", auth, controllersAssets.getAllAssets)
router.get("/assets/:id", auth, controllersAssets.getOneAsset)
router.get("/assets-projects", auth, controllersAssets.getAllProjectAssets)
router.post("/assets", auth, controllersAssets.createAsset)
router.put("/assets", auth, controllersAssets.editAsset)
// router.get("/assets", auth, controllersAssets.deleteAsset)

router.get("/employees", auth, controllersEmployees.getAllEmployees)
router.get("/employees-with-items", auth, controllersEmployees.getAllEmployeesWithItems)
router.get("/employees/:id", auth, controllersEmployees.getOneEmployee)
router.post("/employees", auth, controllersEmployees.createNewEmployee)
router.put("/employees", auth, controllersEmployees.editEmployee)
router.delete("/employees/:id", auth, controllersEmployees.deleteEmployee)

router.get("/equipments", auth, controllersEquipment.getAllEquipments)
router.get("/equipments/e/:id", auth, controllersEquipment.getOneEquipment)
router.post("/equipments", auth, controllersEquipment.createNewEquipment)
router.put("/equipments", auth, controllersEquipment.editEquipment)

router.get("/equipments/maintenance/:id", auth, controllersEquipment.getOneEquipmentMaintenance)
router.post("/equipments/maintenance", auth, controllersEquipment.createNewEquipmentMaintenance)
router.put("/equipments/maintenance", auth, controllersEquipment.editEquipmentMaintenance)


router.get("/visits", auth, controllersVisits.getAllVisits)
router.get("/visits/:id", auth, controllersVisits.getOneVisit)
router.post("/visits", auth, controllersVisits.createNewVisit)
router.put("/visits", auth, controllersVisits.editVisit)
router.delete("/visits", auth, controllersVisits.deleteVisit)


export { router };