import Group from "../models/Group.model.js";
import Message from "../models/Message.model.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members, creator } = req.body;

    if (!name || !members.length || !creator) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const group = new Group({ name, members: [...members, creator], creator });
    await group.save();

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};
