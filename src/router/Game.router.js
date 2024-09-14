import { Router } from "express";
import { createRoom, inputHandler, joinRoom } from "../controller/gamer.controller.js";

const router = Router()


router.route("/createRoom").post(createRoom)
router.route("/joinRoom").post(joinRoom)
router.route("/inputHandler").post(inputHandler)



export {router}