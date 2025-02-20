import Message from "../models/Message.model.js";
import Group from "../models/Group.model.js";

export const getMessages = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    // Check if it's a group chat
    const group = await Group.findById(conversationId);

    let messages;
    if (group) {
      // Fetch messages for group chat
      messages = await Message.find({ group: conversationId })
        .populate("sender", "name email")
        .populate("receivers", "name email")
        .sort({ createdAt: -1 });
    } else {
      // Fetch messages for private chat (between user & another individual)
      messages = await Message.find({
        $or: [
          { sender: userId, receivers: conversationId },
          { sender: conversationId, receivers: userId },
        ],
      })
        .populate("sender", "name email")
        .populate("receivers", "name email")
        .sort({ createdAt: -1 });
    }

    // // If it's a group with no messages, return empty array but include group info
    // if (group && messages.length === 0) {
    //   return res.json({
    //     group: {
    //       id: group._id,
    //       name: group.name,
    //       members: group.members,
    //     },
    //     messages: [],
    //   });
    // }

    res.json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch messages where the user is either the sender or a receiver
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receivers: userId },
        { group: { $ne: null } },
      ],
    })
      .populate("sender", "name")
      .populate("receivers", "name")
      .populate("group", "name members")
      .sort({ createdAt: -1 }); // Sort messages by latest first

    const conversationsMap = new Map();
    console.log(messages);
    messages.forEach((msg) => {
      if (msg.group) {
        const groupId = msg.group._id.toString();
        if (!conversationsMap.has(groupId)) {
          conversationsMap.set(groupId, {
            conversationId: groupId,
            title: msg.group.name,
            isGroup: true,
            members: msg.group.members.map((user) => ({
              userId: user._id,
              name: user.name,
            })),
            lastMessage: msg.text || "Attachment", // Store last message
            lastMessageTime: msg.createdAt,
          });
        }
      } else {
        msg.receivers.forEach((receiver) => {
          const otherUserId =
            receiver._id.toString() === userId
              ? msg.sender._id.toString()
              : receiver._id.toString();
          if (
            !conversationsMap.has(otherUserId)
            // || conversationsMap.get(otherUserId).lastMessageTime < msg.createdAt
          ) {
            conversationsMap.set(otherUserId, {
              conversationId: otherUserId,
              title: receiver.name,
              isGroup: false,
              members: [{ userId: receiver._id, name: receiver.name }],
              lastMessage: messages[0]?.text,
              lastMessageTime: messages[0]?.createdAt,
            });
          }
        });
      }
    });

    // Include groups where the user is a member (even if no messages exist)
    const userGroups = await Group.find({ members: userId }).populate(
      "members",
      "name"
    );

    userGroups.forEach((group) => {
      const groupId = group._id.toString();
      if (!conversationsMap.has(groupId)) {
        // Get last message for the group if available
        const lastMessage = messages.find(
          (msg) => msg.group?._id.toString() === groupId
        );
        conversationsMap.set(groupId, {
          conversationId: groupId,
          title: group.name,
          isGroup: true,
          members: group.members.map((user) => ({
            userId: user._id,
            name: user.name,
          })),
          lastMessage: lastMessage
            ? lastMessage.text || "Attachment"
            : "No messages yet",
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        });
      }
    });

    // Convert Map to sorted array based on lastMessageTime
    const conversations = Array.from(conversationsMap.values()).sort((a, b) => {
      const timeA = a.lastMessageTime || new Date(a.createdAt); // Use group creation date if no messages
      const timeB = b.lastMessageTime || new Date(b.createdAt);
      return new Date(timeB) - new Date(timeA); // Sort latest first
    });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations", error);
    res.status(500).json({ error: "Server error" });
  }
};
