import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { fetchConversations } from "../api/conversation";

const socket = io("http://localhost:5000"); // Adjust URL if hosted

const useChat = ({ appendMessage, currentConvo, messages }) => {
  const [conversations, setConversations] = useState<any[]>([]);

  const addNewMessage = ({ conversationId, title, text, files }) => {
    console.log({ conversationId, conversations });
    if (
      conversations.findIndex((convo) => convo.id === conversationId) === -1
    ) {
      const newConvo = {
        id: conversationId,
        lastMessage: text ? text : "Attachments",
        title: title,
      };
      setConversations((prev) => [newConvo, ...prev]);
    } else {
      const index = conversations.findIndex(
        (convo) => convo.id === conversationId
      );
      const item = conversations[index];
      item.lastMessage = text ? text : "Attachments";
      const tempArr = [...conversations];
      tempArr.splice(index, 1);
      setConversations([item, ...tempArr]);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (!userId) return;

    socket.emit("join", userId);

    // fetchConversations();

    return () => {
      socket.off("newMessage");
      socket.off("newGroup");
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (!userId) return;

    const getConversations = async () => {
      try {
        const data = await fetchConversations(userId);
        console.log(data);

        //   {
        //     "conversationId": "67b24d9250f316894b67e28b",
        //     "title": "Aryan Mahajan",
        //     "isGroup": false,
        //     "members": [
        //         {
        //             "userId": "67b24d9250f316894b67e28b",
        //             "name": "Aryan Mahajan"
        //         }
        //     ]
        // }

        setConversations(
          data.map((convo) => ({
            id: convo.conversationId,
            title: convo.title,
            lastMessage: convo.lastMessage || "No messages yet",
            isGroup: convo.isGroup,
            members: convo.members.map((member) => member.userId),
          }))
        );
        // setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations");
      }
    };

    getConversations();
  }, [messages]);

  const addNewGroup = (members, groupId, name) => {
    setConversations((prev) => [
      {
        id: groupId,
        title: name,
        lastMessage: "No Messages yet",
        isGroup: true,
        members,
      },
      ...prev,
    ]);

    socket.emit("newGroup", {
      members: members,
      group: groupId,
      name: name,
      sender: localStorage.getItem("user"),
    });
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      addNewMessage({
        conversationId: message.conversation,
        text: message.text,
        files: message.files,
        title: message.title,
      });

      appendMessage(message);
      //   setMessages((prev) => [...prev, message]);
    });

    socket.on("newGroup", ({ groupId, name, members }) => {
      setConversations((prev) => [
        {
          id: groupId,
          title: name,
          lastMessage: "No Messages yet",
          isGroup: true,
          members,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("newMessage");
      socket.off("newGroup");
    };
  }, [conversations, currentConvo]);

  const sendMessage = ({ reciverIds, text, files, group }) => {
    socket.emit("sendMessage", {
      sender: localStorage.getItem("user"),
      receivers: reciverIds,
      text,
      files,
      group,
    });
  };

  return { conversations, sendMessage, setConversations, addNewGroup };
};

export default useChat;
