import React from "react";
import CustomText from "./CustomText";

function ShowMessage({ view = false, Message }) {
  if (!view) return false;

  return (
    <div
      style={{
        backgroundColor: "#0c71b1",
        width: "100%",
        bottom: 0,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <CustomText
        style={{
          fontSize: 16,
          color: "white",
          alignSelf: "center",
          padding: 15,
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: Message,
          }}
        ></div>
        {/* {Message} */}
      </CustomText>
    </div>
  );
}

export default ShowMessage;
