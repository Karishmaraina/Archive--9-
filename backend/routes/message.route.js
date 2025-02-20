import express from "express";
import {
  getConversations,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/messages/:userId/:conversationId", getMessages);
router.get("/:userId", getConversations);
export default router;
