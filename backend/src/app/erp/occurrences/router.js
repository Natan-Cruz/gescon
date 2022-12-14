import { Router } from "express";

import * as controller from "./controllers/controllers"

import auth from "../../../midlewares/auth";

const router = Router();

// Obtem todas as ocorrencias
router.get("/:constructionID/occurrences", auth, controller.getAllOccurrences)
// Obtem uma ocorrĂȘncia
router.get("/occurrences/:id", auth, controller.getOneOccurrence)
// Cria uma nova ocorrĂȘncia
router.post("/occurrences", auth, controller.createNewOccurrence)
// Edita uma ocorrencia
router.put("/occurrences/", auth, controller.editOccurrence)
// Define um novo status para ocorrĂȘncia 
router.post("/occurrences/:id/status", auth, controller.addStatusInOccurrence)
// Deleta ocorrencia
router.delete("/occurrences/:id", auth, controller.deleteOccurrence)

router.get("/occurrences-public", controller.getOccurrencePublic)


export { router };
