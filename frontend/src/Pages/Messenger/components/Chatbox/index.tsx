import React from "react";
import Chatbody from "./Chatbody";
import Footer from "./Footer";
import Header from "./Header";

const Chatbox = ({ currentConvo, sendMessage, messages }) => {
  return (
    <div className="h-full bg-slate-100 w-full flex flex-col">
      {currentConvo ? (
        <>
          <Header currentConvo={currentConvo} />
          <Chatbody messages={messages} />
          <Footer sendMessage={sendMessage} />
        </>
      ) : (
        <div className="text-center h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl text-slate-700">Start messaging</h1>
          <p className="text-lg text-slate-500">
            Your messages will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
