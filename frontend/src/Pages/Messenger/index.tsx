import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chatbox from "./components/Chatbox";
import { Navigate, useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { getMessages } from "../../api/conversation";

const Messenger = () => {
  const [currentConvo, setCurrentConvo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  if (!localStorage.getItem("user")) return <Navigate to={"/login"} />;

  const handleAppendMessage = ({ text, conversation }) => {
    if (currentConvo?.id === conversation) {
      const newOwnMessage = {
        sender: "other",
        text: text,
        files: [],
        time: new Date(),
        clientSide: true,
      };
      setMessages([newOwnMessage, ...messages]);
    }
  };

  const { sendMessage, conversations, setConversations, addNewGroup } = useChat(
    {
      appendMessage: handleAppendMessage,
      currentConvo,
      messages,
    }
  );

  const handleSendMessage = (msg) => {
    if (currentConvo?.isGroup) {
      sendMessage({
        reciverIds: currentConvo?.members.filter(
          (member) => member !== localStorage.getItem("user")
        ),

        text: msg.text,
        files: msg.files,
        group: currentConvo?.id,
      });
    } else {
      sendMessage({
        reciverIds: [currentConvo?.id],
        text: msg.text,
        files: msg.files,
        group: null,
      });
    }

    const newOwnMessage = {
      sender: "me",
      text: msg.text,
      files: msg.files,
      time: new Date(),
      clientSide: true,
    };
    setMessages([newOwnMessage, ...messages]);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(currentConvo?.id);
      if (data) {
        setMessages(data);
      }
    };

    if (currentConvo?.id) {
      fetchMessages();
    }
  }, [currentConvo?.id]);

  const handleNewGroup = (grp) => {
    addNewGroup(grp.members, grp?._id, grp?.name);
  };

  console.log(currentConvo);

  return (
    <div className="flex h-[100dvh]">
      <Sidebar
        conversations={conversations}
        setCurrentConvo={(convo) => {
          if (conversations.findIndex((convo) => convo.id) === -1) {
            const newConvo = {
              id: convo.id,
              lastMessage: "No messages yet",
              title: convo.title,
            };
            setConversations((prev) => [newConvo, ...prev]);
          }
          setCurrentConvo(convo);
        }}
        handleAddGroup={(group) => {
          handleNewGroup(group);
        }}
      />
      <Chatbox
        currentConvo={currentConvo}
        sendMessage={handleSendMessage}
        messages={messages}
      />
    </div>
  );
};

export default Messenger;
