import React from "react";
import moment from "moment";

const Message = ({ isOther, text, timeStamp }) => (
  <div className={`flex ${isOther ? 'justify-start' : 'justify-end'} mb-4`}>
    <div
      className={`max-w-[70%] rounded-lg p-3 ${
        isOther ? 'bg-white' : 'bg-[#d9fdd3]'
      }`}
    >
      <p className="text-sm text-[#111b21]">{text}</p>
      <div className="flex justify-end mt-1">
        <span className="text-xs text-[#667781]">
          {new Date(timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  </div>
);

export default Message;