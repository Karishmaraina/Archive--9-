import React from "react";
import { getNameInitials } from "../../../../../utils";

const Conversations = ({ conversations, selectConvo }) => {
  const Conversation = ({ title, id, lastMessage, isGroup, members }) => {
    return (
      <div
        className="flex gap-2 items-center border-[1px] cursor-pointer p-2 rounded-md mb-2 hover:bg-slate-50"
        onClick={() =>
          selectConvo({
            isGroup: isGroup,
            id,
            title: title,
            members: members,
          })
        }
      >
        <div className="flex justify-center items-center bg-[#eeeeee] w-[40px] h-[40px] rounded-full relative">
          {getNameInitials(title)}
          <span className="bg-green-500 inline-block w-[10px] h-[10px] rounded-xl absolute bottom-[1px] right-[1px] border-[1px] border-white"></span>
        </div>
        <div>
          <h1 className="text-lg">{title}</h1>
          <p className="text-sm text-slate-600">{lastMessage}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2">
      <h1 className="text-xl text-black font-semibold mt-2 mb-4">
        Conversations
      </h1>
      <div>
        {conversations.length === 0 && (
          <p className="text-center my-8">No chats found</p>
        )}
        {conversations.map((convo) => (
          <Conversation
            title={convo.title}
            id={convo.id}
            lastMessage={convo.lastMessage}
            members={convo.members}
            isGroup={convo.isGroup}
          />
        ))}
      </div>
    </div>
  );
};

export default Conversations;
