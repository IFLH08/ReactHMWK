import {Router} from "express"
import { getUsers, getUser, postUser, putUser, delUser } from "../controllers/users.controllers.js"
import { requireAdmin, validateJWT } from "../utils/jwt.js"

const router = Router()

router.get("/users",validateJWT, requireAdmin, getUsers)
router.get("/users/:id",validateJWT, getUser)
router.post("/users",validateJWT, requireAdmin, postUser)
router.put("/users/:id",validateJWT, requireAdmin, putUser)
router.delete("/users/:id",validateJWT, requireAdmin, delUser)

export default router
