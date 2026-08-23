import { collisionBoxes } from "../data/mapCollision";

function CollisionDebug() {
    return (
        <>
            {collisionBoxes.map((box) => (
                <div
                    key={box.name}
                    style={{
                        position: "absolute",
                        left: box.x,
                        top: box.y,
                        width: box.width,
                        height: box.height,
                        background: "rgba(255, 0, 0, 0.25)",
                        border: "2px solid red",
                        boxSizing: "border-box",
                        pointerEvents: "none",
                        zIndex: 20,
                    }}
                />
            ))}
        </>
    );
}

export default CollisionDebug;