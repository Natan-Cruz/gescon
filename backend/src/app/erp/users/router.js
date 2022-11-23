import { Router } from "express";

import auth from "../../../midlewares/auth";
import Upload from "./middleware/uploader";

import * as controllersUserAdmin from "./controllers/userAdmin" ;
import * as controllersUser from "./controllers/user";
import * as controllersUserAvantar from "./controllers/userAvatar";
import * as controllersUserAuth from "./controllers/userAuth";
import * as controllersRolersAndPermissions from "./controllers/rolesAndPermissions"
const router = Router();

// [ ADMIN ]
router.get("/users/admin", auth, controllersUserAdmin.getAllUsers);
router.get("/users/admin/:id", auth, controllersUserAdmin.getOneUser);
router.post("/users/admin", auth, controllersUserAdmin.createNewUser);
router.put("/users/admin", auth, controllersUserAdmin.editUser);
router.put("/users/admin/:id/disable", auth, controllersUserAdmin.disableUser);

// PERMISSIONS AND ROLES
router.get("/access-control", auth, controllersRolersAndPermissions.getAccessControl);

router.get("/companies/permissions", auth, controllersRolersAndPermissions.getPermissions);

router.get("/companies/roles", auth, controllersRolersAndPermissions.getRoles);
router.get("/companies/roles/:id", auth, controllersRolersAndPermissions.getOneRole);
router.post("/companies/roles", auth, controllersRolersAndPermissions.createNewRole)
router.put("/companies/roles", auth, controllersRolersAndPermissions.editRole)
router.delete("/companies/roles", auth, controllersRolersAndPermissions.deleteRole)


// [ USER ]
router.post("/users/authenticate", controllersUserAuth.authenticate )
router.get("/users/refresh-token", controllersUserAuth.refreshToken )

router.put("/users/edit", auth, controllersUser.editMyAccount )
router.put("/users/change-password", auth, controllersUser.changePassword )
router.post("/users/send-confimation-email", auth, controllersUser.sendConfirmationEmail )
router.get("/users/confirm-email", controllersUser.confirmEmail );

// device token
router.post("/users/device-token", auth, controllersUser.saveDeviceToken)
router.put("/users/device-token", auth, controllersUser.removeDeviceToken)

router.post("/users/upload-photo", Upload.single('image'), auth, controllersUserAvantar.uploadPhoto )
router.delete("/users/remove-photo", auth, controllersUserAvantar.removePhoto )

router.post("/users/reset-password/send-token", controllersUserAuth.sendResetTokenToUserEmail )
router.post("/users/reset-password/verify-token", controllersUserAuth.verifyToken )
router.post("/users/reset-password", controllersUserAuth.resetPassword )


export { router };
