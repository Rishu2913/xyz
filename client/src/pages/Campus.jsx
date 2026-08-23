import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatarImage from "../assets/avatar.svg";
import { ROOMS } from "../data/campusData";
import Avatar from "../components/campus/Avatar";
import CampusRoom from "../components/campus/campusRoom";

function Campus() {
    const navigate = useNavigate();
    const [position, setPosition] = useState({
        x: 500,
        y: 350,
    });

    const [nearRoom, setNearRoom] = useState(null);
    const [direction, setDirection] = useState("down");

    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
    });

    const getNearbyRoom = (x, y) => {
        const AVATAR_SIZE = 50;
        const INTERACTION_DISTANCE = 70;

        return ROOMS.find((room) => {
            if (!room.door) return false;

            const door = room.door;

            let doorX;
            let doorY;

            if (door.side === "top") {
                doorX = room.x + door.position + door.width / 2;
                doorY = room.y;
            }

            if (door.side === "bottom") {
                doorX = room.x + door.position + door.width / 2;
                doorY = room.y + room.height;
            }

            if (door.side === "left") {
                doorX = room.x;
                doorY = room.y + door.position + door.width / 2;
            }

            if (door.side === "right") {
                doorX = room.x + room.width;
                doorY = room.y + door.position + door.width / 2;
            }

            const avatarCenterX = x + AVATAR_SIZE / 2;
            const avatarCenterY = y + AVATAR_SIZE / 2;

            const distance = Math.hypot(
                avatarCenterX - doorX,
                avatarCenterY - doorY
            );

            return distance <= INTERACTION_DISTANCE;
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

        const AVATAR_SIZE = 50;
        const SPEED = 4;

        const checkCollision = (x, y) => {
            return ROOMS.some((room) => {
                const avatarLeft = x;
                const avatarRight = x + AVATAR_SIZE;
                const avatarTop = y;
                const avatarBottom = y + AVATAR_SIZE;

                const roomLeft = room.x;
                const roomRight = room.x + room.width;
                const roomTop = room.y;
                const roomBottom = room.y + room.height;

                // First check if avatar is inside the room.
                const insideRoom =
                    avatarLeft >= roomLeft &&
                    avatarRight <= roomRight &&
                    avatarTop >= roomTop &&
                    avatarBottom <= roomBottom;

                if (insideRoom) {
                    return false;
                }

                // No door = entire room is solid.
                if (!room.door) {
                    return (
                        avatarLeft < roomRight &&
                        avatarRight > roomLeft &&
                        avatarTop < roomBottom &&
                        avatarBottom > roomTop
                    );
                }

                const door = room.door;

                let doorLeft;
                let doorRight;
                let doorTop;
                let doorBottom;

                if (door.side === "top" || door.side === "bottom") {
                    doorLeft = roomLeft + door.position;
                    doorRight = doorLeft + door.width;

                    if (door.side === "top") {
                        doorTop = roomTop - 10;
                        doorBottom = roomTop + 20;
                    } else {
                        doorTop = roomBottom - 20;
                        doorBottom = roomBottom + 10;
                    }
                }

                if (door.side === "left" || door.side === "right") {
                    doorTop = roomTop + door.position;
                    doorBottom = doorTop + door.width;

                    if (door.side === "left") {
                        doorLeft = roomLeft - 10;
                        doorRight = roomLeft + 20;
                    } else {
                        doorLeft = roomRight - 20;
                        doorRight = roomRight + 10;
                    }
                }

                const touchingRoom =
                    avatarLeft < roomRight &&
                    avatarRight > roomLeft &&
                    avatarTop < roomBottom &&
                    avatarBottom > roomTop;

                const touchingDoor =
                    avatarLeft < doorRight &&
                    avatarRight > doorLeft &&
                    avatarTop < doorBottom &&
                    avatarBottom > doorTop;

                return touchingRoom && !touchingDoor;
            });
        };

        const move = () => {
            setPosition((prev) => {
                let { x, y } = prev;

                let nextX = x;
                let nextY = y;

                if (keys.current.a) {
                    nextX -= SPEED;
                }

                if (keys.current.d) {
                    nextX += SPEED;
                }

                if (!checkCollision(nextX, y)) {
                    x = nextX;
                }

                if (keys.current.w) {
                    nextY -= SPEED;
                }

                if (keys.current.s) {
                    nextY += SPEED;
                }

                if (!checkCollision(x, nextY)) {
                    y = nextY;
                }

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

    useEffect(() => {
        const handleDirection = (event) => {
            const key = event.key.toLowerCase();

            if (key === "w" || key === "arrowup") {
                setDirection("up");
            }

            if (key === "s" || key === "arrowdown") {
                setDirection("down");
            }

            if (key === "a" || key === "arrowleft") {
                setDirection("left");
            }

            if (key === "d" || key === "arrowright") {
                setDirection("right");
            }
        };

        window.addEventListener("keydown", handleDirection);

        return () => {
            window.removeEventListener("keydown", handleDirection);
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
                <CampusRoom
                    key={room.id}
                    room={room}
                />
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
            <Avatar
                position={position}
                direction={direction}
                image={avatarImage}
            />
        </div>
    );
}

export default Campus;