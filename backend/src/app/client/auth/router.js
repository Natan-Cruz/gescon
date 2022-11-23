import { Router } from "express";
import * as controllersClient from "./controllers/client"
import * as controllersClientAuth from "./controllers/clientAuth"
import auth from "../../../midlewares/auth"

const router = Router();

router.post("/authenticate", controllersClient.authenticate )
router.put("/edit", auth, controllersClient.editMyAccount )
router.put("/change-password", auth, controllersClient.changePassword )

router.post("/users/reset-password/send-token", controllersClientAuth.sendResetTokenToUserEmail )
router.post("/users/reset-password/verify-token", controllersClientAuth.verifyToken )
router.post("/users/reset-password", controllersClientAuth.resetPassword )

export { router };
