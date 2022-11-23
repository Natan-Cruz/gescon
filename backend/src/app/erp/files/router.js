import { Router } from "express";
import { routerSaveFile } from "./saveFile/controller"
import * as controllers from "./controllers"
import auth from "../../../midlewares/auth";

const router = Router();

// Main router, for save files
router.post("/", auth, routerSaveFile);

// Cria todos os diretorios
router.post("/init-upload", auth, controllers.initUpload)

// Download
router.get("/:id", controllers.donwloadFile);

// edita ou deleta arquivos
router.put("/", auth, controllers.editOrDeleteFiles);

// Edit attachment
router.put("/:id", auth, controllers.editFile);

// Get informations about file-attachment
router.get("/:id/informations", controllers.getInformationsAboutFile);

// Delete
router.delete("/:id", auth, controllers.deleteFile);

export { router };