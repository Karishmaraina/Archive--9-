import React from "react";
import { getNameInitials } from "../../../../../utils";

const Header = ({ currentConvo }) => {
  return (
    <div className="bg-green-700 p-2">
      <div className="flex gap-2 items-center  cursor-pointer p-2 rounded-md">
        <div className="flex justify-center items-center bg-[#eeeeee] w-[40px] h-[40px] rounded-full relative">
          {getNameInitials(currentConvo?.title)}
        </div>
        <div>
          <h1 className="text-lg text-slate-200 font-semibold">
            {currentConvo?.title}
          </h1>
          {currentConvo?.isGroup ? (
            <p className="text-xs text-slate-300 mt-[-4px]">
              {currentConvo.members.length} members
            </p>
          ) : (
            <p className="text-xs text-slate-300 mt-[-4px]">Online</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
