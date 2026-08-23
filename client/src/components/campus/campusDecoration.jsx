function CampusDecoration() {
    return (
        <>
            {/* Horizontal walkway */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: "340px",
                    width: "100%",
                    height: "80px",
                    backgroundColor: "#c9b99a",
                    zIndex: 0,
                }}
            />

            {/* Vertical walkway */}
            <div
                style={{
                    position: "absolute",
                    left: "450px",
                    top: 0,
                    width: "100px",
                    height: "100%",
                    backgroundColor: "#c9b99a",
                    zIndex: 0,
                }}
            />

            {/* Trees */}
            <div
                style={{
                    position: "absolute",
                    left: "30px",
                    top: "350px",
                    fontSize: "40px",
                    zIndex: 1,
                }}
            >
                🌳
            </div>

            <div
                style={{
                    position: "absolute",
                    right: "30px",
                    top: "350px",
                    fontSize: "40px",
                    zIndex: 1,
                }}
            >
                🌳
            </div>

            <div
                style={{
                    position: "absolute",
                    left: "30px",
                    top: "30px",
                    fontSize: "40px",
                    zIndex: 1,
                }}
            >
                🌳
            </div>

            <div
                style={{
                    position: "absolute",
                    right: "30px",
                    top: "30px",
                    fontSize: "40px",
                    zIndex: 1,
                }}
            >
                🌳
            </div>
        </>
    );
}

export default CampusDecoration;