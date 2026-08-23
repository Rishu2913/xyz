function Avatar({ position, direction, image }) {
    return (
        <img
            src={image}
            alt="Player"
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                width: "50px",
                height: "50px",
                objectFit: "contain",
                zIndex: 10,
                userSelect: "none",
                pointerEvents: "none",
                transform:
                    direction === "left"
                        ? "scaleX(-1)"
                        : "scaleX(1)",
            }}
        />
    );
}

export default Avatar;