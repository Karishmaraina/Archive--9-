import React, { useState } from "react";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { MdGroupAdd } from "react-icons/md";
import Conversations from "./Conversations";
import AllUsers from "./AllUsers";
import Group from "./Group";

const Sidebar = ({ conversations, setCurrentConvo, handleAddGroup }) => {
  const [mode, setMode] = useState("chats");

  const goBack = () => setMode("chats");

  return (
    <div className="w-[45%] max-w-[800px] bg-white py-2 px-1">
      <h1>Logged in user: {localStorage.getItem("userName")}</h1>

      <hr className="mt-4" />
      {mode === "chats" && (
        <Conversations
          conversations={conversations}
          selectConvo={setCurrentConvo}
        />
      )}

      {mode === "users" && (
        <AllUsers
          selectConvo={(convo) => {
            setCurrentConvo(convo);
            goBack();
          }}
        />
      )}

      {mode === "group" && (
        <Group
          goBack={goBack}
          handleGroupCreated={(grp) => {
            handleAddGroup(grp);
          }}
        />
      )}

      <div className="flex justify-between p-4 ">
        {mode !== "chats" && (
          <button
            className="title-bar-btn !bg-white !text-green-700 border-[1px] !border-green-700"
            onClick={() => setMode("chats")}
          >
            Go Back
          </button>
        )}
        {mode === "chats" && (
          <button className="title-bar-btn" onClick={() => setMode("users")}>
            <BiSolidMessageSquareAdd size={"22px"} />
            New chat
          </button>
        )}

        {mode === "chats" && (
          <button className="title-bar-btn" onClick={() => setMode("group")}>
            <MdGroupAdd size={"22px"} />
            New group
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
