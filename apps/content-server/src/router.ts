import { Router } from "express";
import * as api from "./api";

const router = Router();

router.get("/thumb/*", api.getFile);

export default router;
