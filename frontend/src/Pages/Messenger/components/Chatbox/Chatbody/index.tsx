import React, { useEffect, useRef } from "react";
import Message from "./Message";

const Chatbody = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log({ messages });

  const transformMessagesForNonGroup = (arr) => {
    return [...arr].reverse().map((msg) => {
      if (msg.clientSide) return msg;
      return {
        sender:
          msg?.sender?._id === localStorage.getItem("user") ? "me" : "other",
        text: msg.text,
        time: msg.createdAt,
      };
    });
  };

  return (
    <div className="flex-grow bg-[#efeae2] p-4 overflow-y-auto">
      {transformMessagesForNonGroup(messages).map((msg) => (
        <Message
          isOther={msg.sender === "other"}
          text={msg.text}
          image={null}
          timeStamp={msg.time}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatbody;
