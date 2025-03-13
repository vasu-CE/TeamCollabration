import expres from "express"
import { creatMark , getMarks} from "../controllers/marks.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";
import {isFaculty} from "../utils/helper.js";

const router = expres.Router();

router.post('/create', isAuthenticated , isFaculty , creatMark);
// router.post('/update/:id' , isAuthenticated , isFaculty , updateMark);
router.get('/getMarks', isAuthenticated , isFaculty , getMarks);
export default router;