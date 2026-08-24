import React from "react";

function OtherAvatar({
    position,
    direction,
    image,
    username
}) {
    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,

                width: "50px",
                height: "50px",

                pointerEvents: "none",

                zIndex: 10
            }}
        >
            <img
                src={image}
                alt={username}
                style={{
                    width: "50px",
                    height: "50px",
                    imageRendering: "pixelated"
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: "52px",
                    left: "50%",

                    transform: "translateX(-50%)",

                    whiteSpace: "nowrap",

                    color: "#fff",
                    background: "rgba(0, 0, 0, 0.8)",

                    padding: "3px 6px",

                    fontFamily: "monospace",
                    fontSize: "11px",

                    border: "1px solid #fff"
                }}
            >
                {username}
            </div>
        </div>
    );
}

export default OtherAvatar;