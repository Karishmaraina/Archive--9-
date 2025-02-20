import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

const Footer = ({ sendMessage }) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [emojisOpened, setEmojisOpened] = useState(false);

  const handleButtonClick = () => {
    fileInputRef?.current?.click(); // Trigger file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSend = () => {
    if (text.trim() || fileName) {
      sendMessage({
        text: text,
        files: fileName ? [fileName] : [],
      });
      setText("");
      setFileName("");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gray-100 px-2 py-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <BsEmojiSmile
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            size={22}
            onClick={() => setEmojisOpened((prev) => !prev)}
          />
          {emojisOpened && (
            <div className="absolute bottom-[48px]">
              <EmojiPicker
                onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
              />
            </div>
          )}
        </div>
        <GrAttachment
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          size={22}
          onClick={handleButtonClick}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <input
        type="text"
        placeholder="Type a message"
        className="flex-grow px-2 py-2 text-lg outline-none rounded-s-xl"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        className="bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600 transition"
        onClick={handleSend}
      >
        <BsSend size={20} />
      </button>
    </div>
  );
};

export default Footer;