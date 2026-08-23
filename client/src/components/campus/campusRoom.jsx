function CampusRoom({ room }) {
    return (
        <div
            style={{
                position: "absolute",
                left: room.x,
                top: room.y,
                width: room.width,
                height: room.height,
                backgroundColor: "#d6b98c",
                border: "6px solid #765c3a",
                borderRadius: "12px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#3d2f20",
            }}
        >
            {room.name}
        </div>
    );
}

export default CampusRoom;