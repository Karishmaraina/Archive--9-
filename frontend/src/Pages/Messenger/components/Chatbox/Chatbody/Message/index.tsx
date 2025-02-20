import React from "react";
import moment from "moment";
const Message = ({ isOther, text, image, timeStamp }) => {
  return (
    <div
      style={{
        marginRight: isOther ? "15%" : "0px",
        marginLeft: isOther ? "0px" : "15%",
        marginBottom: "20px",
        display: "flex",

        justifyContent: isOther ? "flex-start" : "flex-end",
      }}
    >
      <div>
        <div
          style={{
            backgroundColor: isOther ? "#dcffdc" : "white",
            borderRadius: "8px",
            borderBottomLeftRadius: isOther ? "0px" : "8px",
            borderBottomRightRadius: isOther ? "8px" : "0px",
            padding: "8px 14px",
            width: "fit-content",
            minWidth: "100px",
          }}
        >
          <p>{text}</p>
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "lightslategray",
            marginTop: "2px",
            display: "block",
            textAlign: isOther ? "left" : "right",
          }}
        >
          {moment(timeStamp).fromNow()}
        </span>
      </div>
    </div>
  );
};

export default Message;
