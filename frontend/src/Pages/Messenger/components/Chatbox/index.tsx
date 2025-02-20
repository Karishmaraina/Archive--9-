import React from "react";
import Chatbody from "./Chatbody";
import Footer from "./Footer";
import Header from "./Header";

const Chatbox = ({ currentConvo, sendMessage, messages }) => {
  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      {currentConvo ? (
        <>
          <Header currentConvo={currentConvo} />
          <Chatbody messages={messages} />
          <Footer sendMessage={sendMessage} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-2xl text-slate-700">Start messaging</h1>
          <p className="text-lg text-slate-500">Your messages will appear here</p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;