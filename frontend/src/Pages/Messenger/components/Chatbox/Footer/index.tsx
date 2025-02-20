import React, { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

const Footer = ({ sendMessage }) => {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    sendMessage({
      text: text,
      fils: [],
    });
    setText("");
  };

  return (
    <div className="flex items-center gap-3 bg-white px-2 py-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <BsEmojiSmile
            className="cursor-pointer"
            size={"22px"}
            onClick={() => setEmojisOpened((prev) => !prev)}
          />
          {emojisOpened && (
            <div className="absolute bottom-[48px]">
              <EmojiPicker
                onEmojiClick={(emoji) => setText((prev) => prev + emoji?.emoji)}
              />
            </div>
          )}
        </div>
        <GrAttachment
          className="cursor-pointer"
          size={"22px"}
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
        placeholder="Enter your message here..."
        className="flex-grow"
        style={{ fontSize: "18px", padding: "8px 8px", outline: "none" }}
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button className="title-bar-btn w-[80px]" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default Footer;
