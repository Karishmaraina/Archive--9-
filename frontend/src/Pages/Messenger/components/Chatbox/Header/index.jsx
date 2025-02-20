import React, { useState } from "react";
import { getNameInitials } from "../../../../../utils";
import { Search, MoreVertical } from "lucide-react"; // Importing icons from Lucide React

const Header = ({ currentConvo, onClearChat, onDeleteChat, onContactInfo, onMuteNotifications, onReport, onBlock }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


// Search Chat Function
const searchChat = async () => {
  try {
    const response = await fetch(`/api/messages/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: currentConvo._id, query: searchQuery }),
    });
    const data = await response.json();
    console.log("Search Results:", data);
  } catch (error) {
    console.error("Error searching chat:", error);
  }
};

// Clear Chat Function
const clearChat = async () => {
  try {
    const response = await fetch(`/api/messages/${currentConvo._id}`, { method: "DELETE" });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error clearing chat:", error);
  }
};

// Delete Chat Function
const deleteChat = async () => {
  try {
    const response = await fetch(`/api/message/${currentConvo._id}`, { method: "DELETE" });
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
};

  return (
    <div className="bg-gray-100 p-2 flex justify-between items-center relative">
      <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
        <div className="relative flex items-center justify-center w-[40px] h-[40px] bg-[#eeeeee] rounded-full">
          {getNameInitials(currentConvo?.title)}
        </div>
        <div>
          <h1 className="text-base font-normal text-slate-900">
            {currentConvo?.title}
          </h1>
          {currentConvo?.isGroup ? (
            <p className="mt-[-4px] text-xs text-slate-300">
              {currentConvo.members.length} members
            </p>
          ) : (
            <p className="mt-[-1px] text-xs text-slate-500">Online</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <Search size={20} className="text-gray-600" />
        </button>
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical size={20} className="text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={onContactInfo}>
                Contact Info
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={onMuteNotifications}>
                Mute Notifications
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={onReport}>
                Report
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={onBlock}>
                Block
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={onClearChat}>
                Clear Chat
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600" onClick={onDeleteChat}>
                Delete Chat
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;