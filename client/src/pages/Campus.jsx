import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ROOMS = [
    {
        id: "lobby",
        name: "Common Lobby",
        x: 100,
        y: 100,
        width: 300,
        height: 180,
    },
    {
        id: "meeting",
        name: "Meeting Room",
        x: 600,
        y: 100,
        width: 300,
        height: 180,
    },
    {
        id: "library",
        name: "Library",
        x: 100,
        y: 450,
        width: 300,
        height: 180,

        door: {
            side: "top",
            position: 150,
            width: 80
        }
    },
    {
        id: "coding",
        name: "Coding Space",
        x: 600,
        y: 450,
        width: 300,
        height: 180,
    },
];

function Campus() {
    const navigate = useNavigate();
    const [position, setPosition] = useState({
        x: 500,
        y: 350,
    });

    const [nearRoom, setNearRoom] = useState(null);

    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
    });

    const getNearbyRoom = (x, y) => {
        const AVATAR_SIZE = 40;
        const INTERACTION_DISTANCE = 50;

        return ROOMS.find((room) => {
            const door = room.door;

            if (!door) return false;

            let doorX;
            let doorY;

            if (door.side === "top" || door.side === "bottom") {
                doorX = room.x + door.position;
                doorY =
                    door.side === "top"
                        ? room.y
                        : room.y + room.height;
            } else {
                doorX =
                    door.side === "left"
                        ? room.x
                        : room.x + room.width;

                doorY = room.y + door.position;
            }

            const avatarCenterX = x + AVATAR_SIZE / 2;
            const avatarCenterY = y + AVATAR_SIZE / 2;

            const distance = Math.sqrt(
                Math.pow(avatarCenterX - doorX, 2) +
                Math.pow(avatarCenterY - doorY, 2)
            );

            return distance < INTERACTION_DISTANCE;
        });
    };

    useEffect(() => {
        const handleInteraction = (event) => {
            if (event.key.toLowerCase() === "e" && nearRoom) {
                const routes = {
                    lobby: "/lobby",
                    meeting: "/meeting",
                    library: "/library",
                    coding: "/coding-space",
                };

                const route = routes[nearRoom];

                if (route) {
                    navigate(route);
                }
            }
        };

        window.addEventListener("keydown", handleInteraction);

        return () => {
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [nearRoom]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();

            if (key in keys.current) {
                keys.current[key] = true;
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();

            if (key in keys.current) {
                keys.current[key] = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        let animationFrame;

        const AVATAR_SIZE = 40;
        const SPEED = 4;

        const checkCollision = (x, y) => {
            return ROOMS.some((room) => {
                return (
                    x < room.x + room.width &&
                    x + AVATAR_SIZE > room.x &&
                    y < room.y + room.height &&
                    y + AVATAR_SIZE > room.y
                );
            });
        };

        const move = () => {
            setPosition((prev) => {
                let { x, y } = prev;

                // -------------------------
                // X movement
                // -------------------------

                let nextX = x;

                if (keys.current.a) {
                    nextX -= SPEED;
                }

                if (keys.current.d) {
                    nextX += SPEED;
                }

                // Check X collision only
                if (!checkCollision(nextX, y)) {
                    x = nextX;
                }

                // -------------------------
                // Y movement
                // -------------------------

                let nextY = y;

                if (keys.current.w) {
                    nextY -= SPEED;
                }

                if (keys.current.s) {
                    nextY += SPEED;
                }

                // Check Y collision only
                if (!checkCollision(x, nextY)) {
                    y = nextY;
                }

                // -------------------------
                // Campus boundaries
                // -------------------------

                const maxX = window.innerWidth - AVATAR_SIZE;
                const maxY = window.innerHeight - AVATAR_SIZE;

                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));
                const nearbyRoom = getNearbyRoom(x, y);
                setNearRoom(nearbyRoom ? nearbyRoom.id : null);

                return { x, y };
            });

            animationFrame = requestAnimationFrame(move);
        };

        animationFrame = requestAnimationFrame(move);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#dff5df",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Campus title */}
            <h1
                style={{
                    position: "absolute",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    margin: 0,
                }}
            >
                Virtual Campus
            </h1>

            {/* Rooms */}
            {ROOMS.map((room) => (
                <div
                    key={room.id}
                    style={{
                        position: "absolute",
                        left: room.x,
                        top: room.y,
                        width: room.width,
                        height: room.height,
                        backgroundColor: "#ffffff",
                        border: "4px solid #333",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        fontWeight: "bold",
                        boxSizing: "border-box",
                    }}
                >
                    {room.name}
                </div>
            ))}

            {nearRoom && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        zIndex: 20,
                    }}
                >
                    Press E to enter{" "}
                    {ROOMS.find((room) => room.id === nearRoom)?.name}
                </div>
            )}

            {/* Avatar */}
            <div
                style={{
                    position: "absolute",
                    left: position.x,
                    top: position.y,
                    width: "40px",
                    height: "40px",
                    backgroundColor: "blue",
                    borderRadius: "50%",
                    zIndex: 10,
                }}
            />
        </div>
    );
}

export default Campus;