import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import avatarImage from "../assets/avatar.svg";
import campusMap from "../assets/campus-map.jpeg";
import Avatar from "../components/campus/Avatar";

// ==========================================
// MAP CONFIG
// ==========================================

const MAP_WIDTH = 1536;
const MAP_HEIGHT = 1024;

const ZOOM = 1.8;

const AVATAR_SIZE = 50;
const SPEED = 4;

// Change this to false after collision boxes
// are positioned correctly.
const DEBUG_COLLISION = false;


// ==========================================
// ROOMS
// ==========================================

const ROOMS = [
    {
        id: "meeting",
        name: "Meeting Room",
        route: "/meeting",

        // Approximate room position on the image
        x: 85,
        y: 85,
        width: 390,
        height: 350,

        door: {
            side: "bottom",
            position: 165,
            width: 65,
        },
    },

    // {
    //     id: "coding",
    //     name: "Coding Room",
    //     route: "/coding-space",

    //     x: 1040,
    //     y: 85,
    //     width: 390,
    //     height: 350,

    //     door: {
    //         side: "bottom",
    //         position: 165,
    //         width: 65,
    //     },
    // },

    {
        id: "library",
        name: "Library Room",
        route: "/library",

        x: 85,
        y: 550,
        width: 390,
        height: 340,

        door: {
            side: "bottom",
            position: 165,
            width: 65,
        },
    },

    {
        id: "study",
        name: "Study Pods",
        route: "/study",

        x: 1040,
        y: 690,
        width: 390,
        height: 210,

        door: {
            side: "bottom",
            position: 165,
            width: 65,
        },
    },
];


// ==========================================
// COLLISION BOXES
// ==========================================
//
// These represent WALLS, not the entire room.
//
// The gaps between boxes are the doors.
//
const CODING_INTERACTION = {
    x: 1130,
    y: 180,
    width: 200,
    height: 80,
    interactionDistance: 70,
};


const OBJECT_COLLISIONS = [
    // ======================================
    // MEETING ROOM
    // ======================================

    // Left bookshelf
    {
        id: "meeting-bookshelf-left",
        x: 105,
        y: 115,
        width: 45,
        height: 80,
    },

    // Right bookshelf
    {
        id: "meeting-bookshelf-right",
        x: 410,
        y: 115,
        width: 45,
        height: 100,
    },

    // Meeting table
    {
        id: "meeting-table",
        x: 200,
        y: 225,
        width: 170,
        height: 100,
    },


    // ======================================
    // CODING ROOM
    // ======================================

    // Top computer desks
    {
        id: "coding-desks",
        x: 1080,
        y: 180,
        width: 300,
        height: 80,
    },

    // Coding room table
    {
        id: "coding-table",
        x: 1120,
        y: 310,
        width: 80,
        height: 60,
    },


    // // ======================================
    // // LIBRARY
    // // ======================================

    // // Top bookshelves
    // {
    //     id: "library-bookshelf-1",
    //     x: 110,
    //     y: 590,
    //     width: 80,
    //     height: 45,
    // },

    // {
    //     id: "library-bookshelf-2",
    //     x: 215,
    //     y: 590,
    //     width: 80,
    //     height: 45,
    // },

    // {
    //     id: "library-bookshelf-3",
    //     x: 320,
    //     y: 590,
    //     width: 80,
    //     height: 45,
    // },

    // // Library tables
    // {
    //     id: "library-table-1",
    //     x: 140,
    //     y: 680,
    //     width: 90,
    //     height: 70,
    // },

    // {
    //     id: "library-table-2",
    //     x: 280,
    //     y: 680,
    //     width: 90,
    //     height: 70,
    // },

    // // Bottom tables
    // {
    //     id: "library-table-3",
    //     x: 140,
    //     y: 790,
    //     width: 90,
    //     height: 70,
    // },

    // {
    //     id: "library-table-4",
    //     x: 280,
    //     y: 790,
    //     width: 90,
    //     height: 70,
    // },


    // ======================================
    // CENTRAL AREA
    // ======================================

    // Central plant/fountain
    {
        id: "central-plant",
        x: 660,
        y: 390,
        width: 160,
        height: 180,
    },

    // Left middle bookshelf
    {
        id: "middle-bookshelf-left",
        x: 515,
        y: 325,
        width: 90,
        height: 55,
    },

    // Right middle bookshelf
    {
        id: "middle-bookshelf-right",
        x: 910,
        y: 325,
        width: 90,
        height: 55,
    },

    // Lower left bookshelf
    {
        id: "middle-bookshelf-lower-left",
        x: 515,
        y: 585,
        width: 90,
        height: 55,
    },

    // Lower right bookshelf
    {
        id: "middle-bookshelf-lower-right",
        x: 910,
        y: 585,
        width: 90,
        height: 55,
    },


    // ======================================
    // STUDY PODS
    // ======================================

    // Study desks
    {
        id: "study-desk-1",
        x: 1080,
        y: 730,
        width: 70,
        height: 60,
    },

    {
        id: "study-desk-2",
        x: 1170,
        y: 730,
        width: 70,
        height: 60,
    },

    {
        id: "study-desk-3",
        x: 1260,
        y: 730,
        width: 70,
        height: 60,
    },

    {
        id: "study-desk-4",
        x: 1350,
        y: 730,
        width: 50,
        height: 60,
    },


    // ======================================
    // NOTICE BOARD
    // ======================================

    {
        id: "notice-board",
        x: 1120,
        y: 520,
        width: 190,
        height: 80,
    },
];

const COLLISION_BOXES = [

    // ======================================
    // OUTER MAP WALLS
    // ======================================

    {
        id: "outer-top",
        x: 0,
        y: 0,
        width: MAP_WIDTH,
        height: 20,
    },

    {
        id: "outer-bottom",
        x: 0,
        y: MAP_HEIGHT - 20,
        width: MAP_WIDTH,
        height: 20,
    },

    {
        id: "outer-left",
        x: 0,
        y: 0,
        width: 20,
        height: MAP_HEIGHT,
    },

    {
        id: "outer-right",
        x: MAP_WIDTH - 20,
        y: 0,
        width: 20,
        height: MAP_HEIGHT,
    },


    // ======================================
    // MEETING ROOM
    // ======================================

    // Top wall
    {
        id: "meeting-top",
        x: 85,
        y: 85,
        width: 390,
        height: 20,
    },

    // Left wall
    {
        id: "meeting-left",
        x: 85,
        y: 85,
        width: 20,
        height: 350,
    },

    // Right wall
    {
        id: "meeting-right",
        x: 455,
        y: 85,
        width: 20,
        height: 350,
    },

    // Bottom-left wall
    {
        id: "meeting-bottom-left",
        x: 85,
        y: 415,
        width: 165,
        height: 20,
    },

    // Bottom-right wall
    {
        id: "meeting-bottom-right",
        x: 315,
        y: 415,
        width: 160,
        height: 20,
    },


    // ======================================
    // CODING ROOM
    // ======================================

    // Top
    {
        id: "coding-top",
        x: 1040,
        y: 85,
        width: 390,
        height: 20,
    },

    // Left
    {
        id: "coding-left",
        x: 1040,
        y: 85,
        width: 20,
        height: 350,
    },

    // Right
    {
        id: "coding-right",
        x: 1410,
        y: 85,
        width: 20,
        height: 350,
    },

    // Bottom-left
    {
        id: "coding-bottom-left",
        x: 1040,
        y: 415,
        width: 165,
        height: 20,
    },

    // Bottom-right
    {
        id: "coding-bottom-right",
        x: 1270,
        y: 415,
        width: 160,
        height: 20,
    },


    // ======================================
    // LIBRARY
    // ======================================

    // Top bookshelves
    {
        id: "library-bookshelf-1",
        x: 115,
        y: 590,
        width: 75,
        height: 28,
    },

    {
        id: "library-bookshelf-2",
        x: 215,
        y: 590,
        width: 75,
        height: 28,
    },

    {
        id: "library-bookshelf-3",
        x: 315,
        y: 590,
        width: 75,
        height: 28,
    },

    // Middle-left table
    {
        id: "library-table-1",
        x: 145,
        y: 665,
        width: 75,
        height: 45,
    },

    // Middle-center table
    {
        id: "library-table-2",
        x: 240,
        y: 665,
        width: 55,
        height: 45,
    },

    // Middle-right table
    {
        id: "library-table-3",
        x: 330,
        y: 665,
        width: 55,
        height: 45,
    },

    // Bottom-left table
    {
        id: "library-table-4",
        x: 145,
        y: 760,
        width: 75,
        height: 45,
    },

    // Bottom-center table
    {
        id: "library-table-5",
        x: 240,
        y: 760,
        width: 60,
        height: 45,
    },

    // Bottom-right table
    {
        id: "library-table-6",
        x: 365,
        y: 775,
        width: 55,
        height: 45,
    },

    // Left wall
    {
        id: "library-left",
        x: 85,
        y: 550,
        width: 20,
        height: 340,
    },

    // Right wall
    {
        id: "library-right",
        x: 455,
        y: 550,
        width: 20,
        height: 340,
    },

    // Bottom left wall
    {
        id: "library-bottom",
        x: 85,
        y: 870,
        width: 160,
        height: 20,
    },

    // Bottom right wall
    {
        id: "library-bottom-left",
        x: 315,
        y: 870,
        width: 165,
        height: 20,
    },

    // Top-left wall
    {
        id: "library-top-left",
        x: 85,
        y: 550,
        width: 365,
        height: 20,
    },

    // // Top-right wall
    // {
    //     id: "library-top-right",
    //     x: 315,
    //     y: 550,
    //     width: 160,
    //     height: 20,
    // },


    // ======================================
    // STUDY PODS
    // ======================================

    // Left
    {
        id: "study-left",
        x: 1040,
        y: 690,
        width: 20,
        height: 210,
    },

    // Right
    {
        id: "study-right",
        x: 1410,
        y: 690,
        width: 20,
        height: 210,
    },

    // Bottom
    {
        id: "study-bottom",
        x: 1040,
        y: 880,
        width: 160,
        height: 20,
    },

    // Bottom-Left
    {
        id: "study-bottom",
        x: 1270,
        y: 880,
        width: 165,
        height: 20,
    },

    // Top-left
    {
        id: "study-top-left",
        x: 1040,
        y: 690,
        width: 365,
        height: 20,
    },

    // // Top-right
    // {
    //     id: "study-top-right",
    //     x: 1270,
    //     y: 690,
    //     width: 160,
    //     height: 20,
    // },
];


// ==========================================
// CAMPUS
// ==========================================

function Campus() {

    const [nearCodingSpace, setNearCodingSpace] = useState(false);

    const navigate = useNavigate();

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const username = storedUser.username || "Player";

    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
    });

    const [position, setPosition] = useState({
        x: 743,
        y: 100,
    });

    const [direction, setDirection] = useState("down");

    const [nearRoom, setNearRoom] = useState(null);

    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,

        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false,
    });


    // ======================================
    // COLLISION CHECK
    // ======================================

    const checkCollision = (x, y) => {

        const player = {
            left: x + 8,
            right: x + AVATAR_SIZE - 8,
            top: y + 8,
            bottom: y + AVATAR_SIZE - 4,
        };

        const allCollisions = [
            ...COLLISION_BOXES,
            ...OBJECT_COLLISIONS,
        ];


        return allCollisions.some((box) => {
            const boxRight = box.x + box.width;
            const boxBottom = box.y + box.height;

            return (
                player.left < boxRight &&
                player.right > box.x &&
                player.top < boxBottom &&
                player.bottom > box.y
            );
        });
    };


    // ======================================
    // FIND NEARBY ROOM
    // ======================================

    const isNearCodingSpace = (x, y) => {
        const avatarCenterX = x + AVATAR_SIZE / 2;
        const avatarCenterY = y + AVATAR_SIZE / 2;

        const left = CODING_INTERACTION.x - 100;
        const right =
            CODING_INTERACTION.x +
            CODING_INTERACTION.width +
            100;

        const top = CODING_INTERACTION.y - 100;
        const bottom =
            CODING_INTERACTION.y +
            CODING_INTERACTION.height +
            100;

        return (
            avatarCenterX >= left &&
            avatarCenterX <= right &&
            avatarCenterY >= top &&
            avatarCenterY <= bottom
        );
    };

    const getNearbyRoom = (x, y) => {

        const avatarCenterX = x + AVATAR_SIZE / 2;
        const avatarCenterY = y + AVATAR_SIZE / 2;

        const INTERACTION_DISTANCE = 70;

        for (const room of ROOMS) {

            const door = room.door;

            let doorX;
            let doorY;

            if (door.side === "top") {

                doorX =
                    room.x +
                    door.position +
                    door.width / 2;

                doorY = room.y;
            }

            if (door.side === "bottom") {

                doorX =
                    room.x +
                    door.position +
                    door.width / 2;

                doorY = room.y + room.height;
            }

            if (door.side === "left") {

                doorX = room.x;

                doorY =
                    room.y +
                    door.position +
                    door.width / 2;
            }

            if (door.side === "right") {

                doorX = room.x + room.width;

                doorY =
                    room.y +
                    door.position +
                    door.width / 2;
            }

            const distance = Math.hypot(
                avatarCenterX - doorX,
                avatarCenterY - doorY
            );

            if (distance <= INTERACTION_DISTANCE) {
                return room;
            }
        }

        return null;
    };


    // ======================================
    // KEYBOARD
    // ======================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            const key = event.key.toLowerCase();

            if (key in keys.current) {
                keys.current[key] = true;
            }

            if (
                [
                    "w",
                    "a",
                    "s",
                    "d",
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright",
                ].includes(key)
            ) {
                event.preventDefault();
            }
        };


        const handleKeyUp = (event) => {

            const key = event.key.toLowerCase();

            if (key in keys.current) {
                keys.current[key] = false;
            }
        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        window.addEventListener(
            "keyup",
            handleKeyUp
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

            window.removeEventListener(
                "keyup",
                handleKeyUp
            );
        };

    }, []);



    useEffect(() => {
        const handleResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    // ======================================
    // DIRECTION
    // ======================================

    useEffect(() => {

        const handleDirection = (event) => {

            const key = event.key.toLowerCase();

            if (
                key === "w" ||
                key === "arrowup"
            ) {
                setDirection("up");
            }

            if (
                key === "s" ||
                key === "arrowdown"
            ) {
                setDirection("down");
            }

            if (
                key === "a" ||
                key === "arrowleft"
            ) {
                setDirection("left");
            }

            if (
                key === "d" ||
                key === "arrowright"
            ) {
                setDirection("right");
            }
        };


        window.addEventListener(
            "keydown",
            handleDirection
        );


        return () => {
            window.removeEventListener(
                "keydown",
                handleDirection
            );
        };

    }, []);


    // ======================================
    // MOVEMENT LOOP
    // ======================================

    useEffect(() => {

        let animationFrame;


        const move = () => {

            setPosition((previous) => {

                let x = previous.x;
                let y = previous.y;


                // --------------------------
                // Horizontal movement
                // --------------------------

                let nextX = x;

                if (
                    keys.current.a ||
                    keys.current.arrowleft
                ) {
                    nextX -= SPEED;
                }

                if (
                    keys.current.d ||
                    keys.current.arrowright
                ) {
                    nextX += SPEED;
                }


                if (!checkCollision(nextX, y)) {
                    x = nextX;
                }


                // --------------------------
                // Vertical movement
                // --------------------------

                let nextY = y;

                if (
                    keys.current.w ||
                    keys.current.arrowup
                ) {
                    nextY -= SPEED;
                }

                if (
                    keys.current.s ||
                    keys.current.arrowdown
                ) {
                    nextY += SPEED;
                }


                if (!checkCollision(x, nextY)) {
                    y = nextY;
                }


                // --------------------------
                // Map boundaries
                // --------------------------

                x = Math.max(
                    20,
                    Math.min(
                        x,
                        MAP_WIDTH - AVATAR_SIZE - 20
                    )
                );

                y = Math.max(
                    20,
                    Math.min(
                        y,
                        MAP_HEIGHT - AVATAR_SIZE - 20
                    )
                );


                // --------------------------
                // Nearby room
                // --------------------------

                const room = getNearbyRoom(x, y);
                setNearRoom(room);

                // const codingNearby = isNearCodingSpace(x, y);
                // setNearCodingSpace(codingNearby);

                const viewportWidth = viewport.width;
                const viewportHeight = viewport.height;

                const scaledMapWidth = MAP_WIDTH * ZOOM;
                const scaledMapHeight = MAP_HEIGHT * ZOOM;

                // Keep avatar roughly in the center
                let cameraX =
                    x * ZOOM +
                    (AVATAR_SIZE * ZOOM) / 2 -
                    viewportWidth / 2;

                let cameraY =
                    y * ZOOM +
                    (AVATAR_SIZE * ZOOM) / 2 -
                    viewportHeight / 2;

                // Don't show outside the map
                cameraX = Math.max(
                    0,
                    Math.min(
                        cameraX,
                        scaledMapWidth - viewportWidth
                    )
                );

                cameraY = Math.max(
                    0,
                    Math.min(
                        cameraY,
                        scaledMapHeight - viewportHeight
                    )
                );

                setCamera({
                    x: cameraX,
                    y: cameraY,
                });

                return {
                    x,
                    y,
                };
            });


            animationFrame =
                requestAnimationFrame(move);
        };


        animationFrame =
            requestAnimationFrame(move);


        return () => {
            cancelAnimationFrame(animationFrame);
        };

    }, []);

    useEffect(() => {
        const checkCodingDistance = () => {
            setPosition((currentPosition) => {
                const nearby = isNearCodingSpace(
                    currentPosition.x,
                    currentPosition.y
                );

                setNearCodingSpace(nearby);

                return currentPosition;
            });
        };

        const interval = setInterval(
            checkCodingDistance,
            50
        );

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleCodingInteraction = (event) => {
            if (
                event.key.toLowerCase() === "e" &&
                nearCodingSpace
            ) {
                navigate("/coding-space");
            }
        };

        window.addEventListener(
            "keydown",
            handleCodingInteraction
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleCodingInteraction
            );
        };
    }, [nearCodingSpace, navigate]);


    // ======================================
    // ENTER ROOM
    // ======================================

    // useEffect(() => {

    //     const handleInteraction = (event) => {

    //         if (
    //             event.key.toLowerCase() === "e" &&
    //             nearRoom
    //         ) {
    //             navigate(nearRoom.route);
    //         }
    //     };


    //     window.addEventListener(
    //         "keydown",
    //         handleInteraction
    //     );


    //     return () => {

    //         window.removeEventListener(
    //             "keydown",
    //             handleInteraction
    //         );
    //     };

    // }, [nearRoom, navigate]);


    // ======================================
    // RENDER
    // ======================================

    return (

        <div
            style={{
                width: "100vw",
                height: "100vh",

                backgroundColor: "#111",

                overflow: "hidden",

                position: "relative",
            }}
        >

            {/* ==================================
                MAP
            ================================== */}

            <div
                style={{
                    position: "absolute",

                    width: `${MAP_WIDTH}px`,
                    height: `${MAP_HEIGHT}px`,

                    left: `${-camera.x}px`,
                    top: `${-camera.y}px`,

                    transform: `scale(${ZOOM})`,
                    transformOrigin: "top left",
                }}
            >

                <img
                    src={campusMap}
                    alt="Virtual Campus"
                    draggable="false"
                    style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: `${MAP_WIDTH}px`,
                        height: `${MAP_HEIGHT}px`,

                        userSelect: "none",
                        pointerEvents: "none",
                    }}
                />


                {/* ==================================
                    COLLISION DEBUG
                ================================== */}

                {DEBUG_COLLISION && (
                    <div
                        style={{
                            position: "absolute",
                            left: CODING_INTERACTION.x - 60,
                            top: CODING_INTERACTION.y - 60,
                            width: CODING_INTERACTION.width + 120,
                            height: CODING_INTERACTION.height + 120,
                            border: "3px solid yellow",
                            backgroundColor: "rgba(255, 255, 0, 0.1)",
                            pointerEvents: "none",
                            zIndex: 8,
                        }}
                    />
                )}

                {DEBUG_COLLISION &&
                    COLLISION_BOXES.map((box) => (

                        <div
                            key={box.id}
                            style={{
                                position: "absolute",

                                left: box.x,
                                top: box.y,

                                width: box.width,
                                height: box.height,

                                backgroundColor:
                                    "rgba(255, 0, 0, 0.25)",

                                border:
                                    "2px solid red",

                                boxSizing:
                                    "border-box",

                                pointerEvents:
                                    "none",

                                zIndex: 5,
                            }}
                        />

                    ))}

                {DEBUG_COLLISION &&
                    OBJECT_COLLISIONS.map((box) => (
                        <div
                            key={box.id}
                            style={{
                                position: "absolute",
                                left: box.x,
                                top: box.y,
                                width: box.width,
                                height: box.height,
                                backgroundColor:
                                    "rgba(0, 120, 255, 0.25)",
                                border: "2px solid blue",
                                boxSizing: "border-box",
                                pointerEvents: "none",
                                zIndex: 7,
                            }}
                        />
                    ))}


                {/* ==================================
                    ROOM DEBUG / DOOR MARKERS
                ================================== */}

                {DEBUG_COLLISION &&
                    ROOMS.map((room) => {

                        const door = room.door;

                        let left;
                        let top;

                        if (
                            door.side === "top" ||
                            door.side === "bottom"
                        ) {

                            left =
                                room.x +
                                door.position;

                            top =
                                door.side === "top"
                                    ? room.y - 5
                                    : room.y +
                                      room.height -
                                      5;

                        } else {

                            left =
                                door.side === "left"
                                    ? room.x - 5
                                    : room.x +
                                      room.width -
                                      5;

                            top =
                                room.y +
                                door.position;
                        }


                        return (

                            <div
                                key={room.id}
                                style={{
                                    position: "absolute",

                                    left,
                                    top,

                                    width:
                                        door.side === "top" ||
                                        door.side === "bottom"
                                            ? door.width
                                            : 10,

                                    height:
                                        door.side === "left" ||
                                        door.side === "right"
                                            ? door.width
                                            : 10,

                                    backgroundColor:
                                        "rgba(0, 255, 0, 0.7)",

                                    border:
                                        "2px solid green",

                                    zIndex: 6,

                                    pointerEvents:
                                        "none",
                                }}
                            />

                        );
                    })}


                {/* ==================================
                    AVATAR
                ================================== */}

                <Avatar
                    position={position}
                    direction={direction}
                    image={avatarImage}
                    username={username}
                />


                {/* ==================================
                    ENTER ROOM MESSAGE
                ================================== */}

                {/* {nearRoom && (

                    <div
                        style={{
                            position: "fixed",

                            bottom: "40px",
                            left: "50%",

                            transform:
                                "translateX(-50%)",

                            backgroundColor:
                                "rgba(0, 0, 0, 0.85)",

                            color: "white",

                            padding:
                                "12px 20px",

                            borderRadius:
                                "8px",

                            fontFamily:
                                "monospace",

                            fontSize:
                                "16px",

                            zIndex: 100,

                            border:
                                "2px solid #fff",
                        }}
                    >

                        <>
                            Press <strong>E</strong> to enter{" "}
                            <strong>{nearRoom.name}</strong>
                        </>

                    </div>

                )} */}

            </div>

            {nearCodingSpace && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",

                        backgroundColor: "rgba(0, 0, 0, 0.85)",
                        color: "white",

                        padding: "12px 20px",
                        borderRadius: "8px",

                        fontFamily: "monospace",
                        fontSize: "16px",

                        zIndex: 100,
                        border: "2px solid #fff",
                    }}
                >
                    Press <strong>E</strong> to enter{" "}
                    <strong>Coding Space</strong>
                </div>
            )}

        </div>
    );
}

export default Campus;