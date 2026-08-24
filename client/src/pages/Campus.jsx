import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import OtherAvatar from "../components/campus/OtherAvatar";

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
        route: "https://galgotiasuniversity.refread.com/#/home",

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

const NOTICE_BOARD_INTERACTION = {
    x: 1120,
    y: 520,
    width: 190,
    height: 80,
    interactionDistance: 90,
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

    const [nearNoticeBoard, setNearNoticeBoard] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [nearCodingSpace, setNearCodingSpace] = useState(false);

    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [meetingLoading, setMeetingLoading] = useState(false);
    const [meetingResult, setMeetingResult] = useState(null);

    const [meetingTitle, setMeetingTitle] = useState(
        "Virtual Campus Meeting"
    );

    const [meetingStartTime, setMeetingStartTime] = useState("16:00");

    const [meetingDuration, setMeetingDuration] = useState("60");

    const socketRef = useRef(null);
    const [otherPlayers, setOtherPlayers] = useState({});

    const navigate = useNavigate();

    const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const username = storedUser.username || "Player";
    const userRole = storedUser.role || "student";

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

    const openLeaderboard = async () => {
        setShowLeaderboard(true);
        setLeaderboardLoading(true);

        try {
            const response = await fetch(
                "http://eduna.onrender.com/api/leaderboard"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load leaderboard"
                );
            }

            setLeaderboard(data.leaderboard || []);

        } catch (error) {
            console.error(
                "Leaderboard error:",
                error
            );

            setLeaderboard([]);

        } finally {
            setLeaderboardLoading(false);
        }
};

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

    const createMeeting = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMeetingResult({
                type: "error",
                message: "You must be logged in."
            });
            return;
        }

        setMeetingLoading(true);
        setMeetingResult(null);

        try {
            const now = new Date();

            const [hours, minutes] =
                meetingStartTime.split(":").map(Number);

            const start = new Date(now);

            start.setHours(hours);
            start.setMinutes(minutes);
            start.setSeconds(0);
            start.setMilliseconds(0);

            // If selected time has already passed today,
            // schedule it for tomorrow.
            if (start <= now) {
                start.setDate(start.getDate() + 1);
            }

            const end = new Date(
                start.getTime() +
                Number(meetingDuration) * 60 * 1000
            );

            const response = await fetch(
                "http://eduna.onrender.com/api/meetings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: meetingTitle,
                        description:
                            "Virtual Campus Meeting",
                        startTime: start.toISOString(),
                        endTime: end.toISOString()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create meeting"
                );
            }

            setMeetingResult({
                type: "success",
                message: "MEETING CREATED!",
                meetingUrl: data.data.meetingUrl
            });

        } catch (error) {
            console.error(
                "Meeting creation error:",
                error
            );

            setMeetingResult({
                type: "error",
                message: error.message
            });

        } finally {
            setMeetingLoading(false);
        }
    };

    const joinMeeting = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No authentication token found");
            return;
        }

        try {
            const response = await fetch(
                "http://eduna.onrender.com/api/meetings/latest",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "No upcoming meeting"
                );
            }

            window.open(
                data.data.meetingUrl,
                "_blank"
            );

        } catch (error) {
            console.error("Join meeting error:", error);

            setMeetingResult({
                type: "error",
                message: error.message
            });
        }
    };

    const isNearNoticeBoard = (x, y) => {
        const avatarCenterX = x + AVATAR_SIZE / 2;
        const avatarCenterY = y + AVATAR_SIZE / 2;

        const centerX =
            NOTICE_BOARD_INTERACTION.x +
            NOTICE_BOARD_INTERACTION.width / 2;

        const centerY =
            NOTICE_BOARD_INTERACTION.y +
            NOTICE_BOARD_INTERACTION.height / 2;

        const distance = Math.hypot(
            avatarCenterX - centerX,
            avatarCenterY - centerY
        );

        return distance <= NOTICE_BOARD_INTERACTION.interactionDistance;
    };

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

        const handleMeetingInteraction = (event) => {

            if (
                event.key.toLowerCase() !== "e" ||
                !nearRoom ||
                showLeaderboard ||
                showMeetingModal
            ) {
                return;
            }

            if (nearRoom.id === "library") {
                window.open(
                    "https://galgotiasuniversity.refread.com/#/home",
                    "_blank"
                );
                return;
            }

            if (nearRoom.id !== "meeting") {
                return;
            }

            if (userRole === "teacher") {
                setMeetingResult(null);
                setShowMeetingModal(true);
            } else {
                joinMeeting();
            }
        };

        window.addEventListener(
            "keydown",
            handleMeetingInteraction
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleMeetingInteraction
            );
        };

    }, [
        nearRoom,
        userRole,
        showLeaderboard,
        showMeetingModal
    ]);


    useEffect(() => {
        const socket = io("https://eduna.onrender.com");

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to multiplayer:", socket.id);

            socket.emit("player:join", {
                username,
                x: position.x,
                y: position.y,
                direction
            });
        });

        socket.on("players:current", (players) => {
            const playerMap = {};

            players.forEach((player) => {
                if (player.id !== socket.id) {
                    playerMap[player.id] = player;
                }
            });

            setOtherPlayers(playerMap);
        });

        socket.on("player:joined", (player) => {
            setOtherPlayers((current) => ({
                ...current,
                [player.id]: player
            }));
        });

        socket.on("player:moved", (player) => {
            setOtherPlayers((current) => ({
                ...current,
                [player.id]: {
                    ...current[player.id],
                    ...player
                }
            }));
        });

        socket.on("player:left", (playerId) => {
            setOtherPlayers((current) => {
                const updated = { ...current };

                delete updated[playerId];

                return updated;
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {

        const handleInteraction = (event) => {

            const key = event.key.toLowerCase();

            if (
                key === "e" &&
                nearNoticeBoard &&
                !showLeaderboard
            ) {
                openLeaderboard();
            }

            if (
                key === "escape" &&
                showLeaderboard
            ) {
                setShowLeaderboard(false);
            }

            if (
                key === "escape" &&
                showMeetingModal
            ) {
                setShowMeetingModal(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleInteraction
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleInteraction
            );
        };

    }, [nearNoticeBoard, showLeaderboard]);

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

                const noticeNearby = isNearNoticeBoard(x, y);
                setNearNoticeBoard(noticeNearby);

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

                if (socketRef.current?.connected) {
                    socketRef.current.emit("player:move", {
                        x,
                        y,
                        direction
                    });
                }

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

                {DEBUG_COLLISION && (
                    <div
                        style={{
                            position: "absolute",

                            left: NOTICE_BOARD_INTERACTION.x,
                            top: NOTICE_BOARD_INTERACTION.y,

                            width: NOTICE_BOARD_INTERACTION.width,
                            height: NOTICE_BOARD_INTERACTION.height,

                            backgroundColor: "rgba(255, 255, 0, 0.35)",
                            border: "3px solid yellow",

                            boxSizing: "border-box",
                            pointerEvents: "none",
                            zIndex: 20,
                        }}
                    />
                )}

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

                {Object.values(otherPlayers).map((player) => (
                    <OtherAvatar
                        key={player.id}
                        position={{
                            x: player.x,
                            y: player.y
                        }}
                        direction={player.direction}
                        image={avatarImage}
                        username={player.username}
                    />
                ))}

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

            {nearRoom?.id === "library" &&
                !showMeetingModal &&
                !showLeaderboard && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "40px",
                            left: "50%",
                            transform: "translateX(-50%)",

                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            color: "#fff",

                            padding: "14px 24px",

                            fontFamily: "'Courier New', monospace",
                            fontSize: "17px",

                            zIndex: 100,

                            border: "3px solid #f5d742",
                            boxShadow: "6px 6px 0px #000",

                            imageRendering: "pixelated",
                        }}
                    >
                        PRESS{" "}
                        <strong style={{ color: "#f5d742" }}>
                            E
                        </strong>{" "}
                        TO{" "}
                        <strong>
                            ENTER LIBRARY
                        </strong>
                    </div>
                )}

            {showMeetingModal && userRole === "teacher" && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor:
                            "rgba(0, 0, 0, 0.65)",

                        zIndex: 1000,
                    }}
                >

                    <div
                        style={{
                            width: "460px",
                            maxWidth: "90vw",

                            backgroundColor: "#171717",

                            border: "4px solid #f5d742",

                            boxShadow:
                                "8px 8px 0px #000",

                            color: "#fff",

                            fontFamily:
                                "'Courier New', monospace",

                            padding: "24px",

                            imageRendering: "pixelated",
                        }}
                    >

                        <div
                            style={{
                                fontSize: "22px",
                                fontWeight: "bold",

                                letterSpacing: "2px",

                                paddingBottom: "14px",

                                borderBottom:
                                    "3px solid #fff",

                                marginBottom: "20px",
                            }}
                        >
                            CREATE MEETING
                        </div>


                        {/* TITLE */}

                        <label>
                            TITLE
                        </label>

                        <input
                            value={meetingTitle}
                            onChange={(e) =>
                                setMeetingTitle(e.target.value)
                            }
                            style={{
                                width: "100%",
                                boxSizing: "border-box",

                                marginTop: "8px",
                                marginBottom: "20px",

                                padding: "12px",

                                backgroundColor: "#222",
                                color: "#fff",

                                border: "2px solid #777",

                                fontFamily:
                                    "'Courier New', monospace",
                            }}
                        />


                        {/* TIME */}

                        <label>
                            START TIME
                        </label>

                        <select
                            value={meetingStartTime}
                            onChange={(e) =>
                                setMeetingStartTime(e.target.value)
                            }
                            style={{
                                width: "100%",
                                boxSizing: "border-box",

                                marginTop: "8px",
                                marginBottom: "20px",

                                padding: "12px",

                                backgroundColor: "#222",
                                color: "#fff",

                                border: "2px solid #777",

                                fontFamily:
                                    "'Courier New', monospace",
                            }}
                        >
                            <option value="16:00">
                                04:00 PM
                            </option>

                            <option value="17:00">
                                05:00 PM
                            </option>

                            <option value="18:00">
                                06:00 PM
                            </option>

                            <option value="19:00">
                                07:00 PM
                            </option>

                            <option value="20:00">
                                08:00 PM
                            </option>
                        </select>


                        {/* DURATION */}

                        <label>
                            DURATION
                        </label>

                        <select
                            value={meetingDuration}
                            onChange={(e) =>
                                setMeetingDuration(e.target.value)
                            }
                            style={{
                                width: "100%",
                                boxSizing: "border-box",

                                marginTop: "8px",
                                marginBottom: "20px",

                                padding: "12px",

                                backgroundColor: "#222",
                                color: "#fff",

                                border: "2px solid #777",

                                fontFamily:
                                    "'Courier New', monospace",
                            }}
                        >
                            <option value="30">
                                30 MINUTES
                            </option>

                            <option value="60">
                                60 MINUTES
                            </option>

                            <option value="90">
                                90 MINUTES
                            </option>

                            <option value="120">
                                120 MINUTES
                            </option>
                        </select>


                        {/* RESULT */}

                        {meetingResult && (
                            <div
                                style={{
                                    marginBottom: "18px",

                                    padding: "12px",

                                    border:
                                        meetingResult.type === "success"
                                            ? "2px solid #54e38e"
                                            : "2px solid #ff5c5c",

                                    color:
                                        meetingResult.type === "success"
                                            ? "#54e38e"
                                            : "#ff5c5c",

                                    wordBreak: "break-word",
                                }}
                            >
                                {meetingResult.message}

                                {meetingResult.meetingUrl && (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {meetingResult.meetingUrl}
                                    </div>
                                )}
                            </div>
                        )}


                        {/* CREATE */}

                        <button
                            onClick={createMeeting}
                            disabled={meetingLoading}
                            style={{
                                width: "100%",

                                padding: "14px",

                                backgroundColor:
                                    "#f5d742",

                                color: "#000",

                                border: "3px solid #fff",

                                fontFamily:
                                    "'Courier New', monospace",

                                fontWeight: "bold",

                                cursor: "pointer",

                                marginBottom: "12px",
                            }}
                        >
                            {meetingLoading
                                ? "CREATING..."
                                : "CREATE MEETING"}
                        </button>


                        <button
                            onClick={() =>
                                setShowMeetingModal(false)
                            }
                            style={{
                                width: "100%",

                                padding: "12px",

                                backgroundColor: "#222",

                                color: "#fff",

                                border: "2px solid #777",

                                fontFamily:
                                    "'Courier New', monospace",

                                cursor: "pointer",
                            }}
                        >
                            ESC / CANCEL
                        </button>

                    </div>
                </div>
            )}

            {showLeaderboard && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        backgroundColor: "rgba(0, 0, 0, 0.55)",

                        zIndex: 1000,
                    }}
                >

                    <div
                        style={{
                            width: "520px",
                            maxWidth: "90vw",

                            backgroundColor: "#171717",

                            border: "4px solid #f5f5f5",

                            boxShadow:
                                "8px 8px 0px #000",

                            color: "#fff",

                            fontFamily:
                                "'Courier New', monospace",

                            imageRendering: "pixelated",
                        }}
                    >

                        {/* HEADER */}

                        <div
                            style={{
                                padding: "16px 20px",

                                borderBottom:
                                    "3px solid #fff",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                    letterSpacing: "2px",
                                }}
                            >
                                🏆 LEADERBOARD
                            </div>

                            <button
                                onClick={() =>
                                    setShowLeaderboard(false)
                                }
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#fff",

                                    fontFamily:
                                        "'Courier New', monospace",

                                    fontSize: "22px",
                                    fontWeight: "bold",

                                    cursor: "pointer",
                                }}
                            >
                                X
                            </button>

                        </div>


                        {/* CONTENT */}

                        <div
                            style={{
                                padding: "15px 20px",
                                maxHeight: "420px",
                                overflowY: "auto",
                            }}
                        >

                            {leaderboardLoading ? (

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 0",
                                        fontSize: "18px",
                                    }}
                                >
                                    LOADING...
                                </div>

                            ) : leaderboard.length === 0 ? (

                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px 0",
                                    }}
                                >
                                    NO SCORES YET
                                </div>

                            ) : (

                                leaderboard.map((student, index) => (

                                    <div
                                        key={student._id}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "60px 1fr 100px",

                                            alignItems: "center",

                                            padding: "12px 8px",

                                            borderBottom:
                                                "2px solid #444",
                                        }}
                                    >

                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "18px",
                                            }}
                                        >
                                            #{student.rank || index + 1}
                                        </div>

                                        <div>
                                            {student.username}
                                        </div>

                                        <div
                                            style={{
                                                textAlign: "right",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {student.totalScore}
                                        </div>

                                    </div>

                                ))

                            )}

                        </div>


                        {/* FOOTER */}

                        <div
                            style={{
                                padding: "12px 20px",

                                borderTop:
                                    "3px solid #fff",

                                fontSize: "13px",
                                textAlign: "center",
                                opacity: 0.7,
                            }}
                        >
                            PRESS ESC TO CLOSE
                        </div>

                    </div>

                </div>
            )}

            {nearRoom?.id === "meeting" &&
                !showMeetingModal &&
                !showLeaderboard && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: "40px",
                            left: "50%",
                            transform: "translateX(-50%)",

                            backgroundColor:
                                "rgba(0, 0, 0, 0.9)",

                            color: "#fff",

                            padding: "14px 24px",

                            fontFamily:
                                "'Courier New', monospace",

                            fontSize: "17px",

                            zIndex: 100,

                            border: "3px solid #f5d742",

                            boxShadow:
                                "6px 6px 0px #000",

                            imageRendering: "pixelated",
                        }}
                    >
                        PRESS{" "}
                        <strong style={{ color: "#f5d742" }}>
                            E
                        </strong>{" "}
                        TO{" "}
                        <strong>
                            {userRole === "teacher"
                                ? "CREATE MEETING"
                                : "JOIN MEETING"}
                        </strong>
                    </div>
                )}

            {nearNoticeBoard &&
                !nearRoom &&
                !nearCodingSpace &&
                !showLeaderboard && (
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
                        Press <strong>E</strong> to view{" "}
                        <strong>Leaderboard</strong>
                    </div>
            )}

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