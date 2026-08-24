function Avatar({ position, direction, image, username }) {
    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: "50px",
                height: "50px",
                zIndex: 10,
                pointerEvents: "none",
                userSelect: "none",
            }}
        >
            {/* Username */}
            <div
                style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginBottom: "4px",

                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",

                    padding: "2px 7px",
                    borderRadius: "4px",

                    fontSize: "12px",
                    fontWeight: "bold",
                    fontFamily: "monospace",

                    whiteSpace: "nowrap",
                }}
            >
                {username}
            </div>

            {/* Avatar */}
            <img
                src={image}
                alt="Player"
                style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                    userSelect: "none",
                    pointerEvents: "none",

                    transform:
                        direction === "left"
                            ? "scaleX(-1)"
                            : "scaleX(1)",
                }}
            />
        </div>
    );
}

export default Avatar;