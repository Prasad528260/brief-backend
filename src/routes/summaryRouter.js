import mongoose from "mongoose";
import router from "express";
import { fileUploadController, getSummary, getTitles, updateTitle, getSummaries } from "../controllers/summaryController.js";
import { upload } from "../middleware/multer.js";
import { userAuth } from "../middleware/userAuth.js";

const summaryRouter = router();

summaryRouter.post("/file-upload",upload.single("file"),userAuth,fileUploadController );
summaryRouter.get('/get-summary/:id', userAuth,getSummary);
summaryRouter.put('/summary/:id/title',userAuth,updateTitle);
summaryRouter.get('/get-titles',userAuth,getTitles);
summaryRouter.get('/get-summaries',userAuth,getSummaries);

export default summaryRouter;