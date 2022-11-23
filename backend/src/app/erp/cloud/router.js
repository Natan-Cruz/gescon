import { Router } from "express";

import * as controllersDirectory from "./controllers/directory"
import * as controllersFolder from "./controllers/folders"
import routerDownloadFolder from "./controllers/downloadFolder";

import auth from "../../../midlewares/auth";

const router = Router();

// Obtem a lista diretório, que é composto por pasta e arquivos
// router.get("/cloud/list-directory", auth, routerGetDirectory);
// Obtem pasta e arquivos
router.get("/cloud/directory", auth, controllersDirectory.getFolderContent);
//Obter todos as pastas e arquivos pesquisados 
router.get("/cloud/directory/search", auth, controllersDirectory.getFoldersAndFilesBySearch);
// 
router.get("/cloud/directory/favorites", auth, controllersDirectory.getFavorites)
// 
router.put("/cloud/toggle-favorite", auth, controllersDirectory.toggleFavorite)


// Obtem informações da pasta
router.get("/cloud/folder/:folderID/informations", auth, controllersFolder.getFolderAndInformations)
// Criar pasta
router.post("/cloud/folder", auth, controllersFolder.createFolder)
// Deletar pasta
router.delete("/cloud/folder/:folderID", auth, controllersFolder.deleteFolder)
// Editar pasta nome da pasta
router.put("/cloud/folder/:folderID", auth, controllersFolder.editFolder)
// Baixar toda a pasta
router.get("/cloud/folder/:folder_id/download", routerDownloadFolder)
// Compartilhar ou remover acesso a pasta
// router.get("/cloud/folder/:folderID/share", auth, routerShareOrNotFolder)

export { router };
