import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

const ResizableGrid = ({ children, sidebarMinSize, sidebarMaxSize }) => {
    const resizableElementRef = useRef(null);
    const parentWidth = useRef(null);
    const [ResizableWidth, setResizableWidth] = useState(0);
    const [ResizableMain, setResizableMain] = useState([]);
    const [ResizableWall,setResizableWall] = useState([])
    const [ResizableSidebar, setResizableSidebar] = useState([]);

    useEffect(() => {
        setResizableWidth(parentWidth.current.clientWidth / 2);

        React.Children.map(children, (child) => {
            if (child.type.name === "ResizableSidebar") {
                setResizableSidebar(child);
            } else if (child.type.name === "ResizableMain") {
                setResizableMain(child);
            } else if (child.type.name === "ResizableWall") {
                setResizableWall(child);
            }
        });
    }, []);

    const handleMouseDown = (event) => {
        const startX = event.pageX;
        const handleMouseMove = (event) => {
            const width = ResizableWidth + (event.pageX - startX);
            const maxWidth = (sidebarMaxSize / 10) * parentWidth.current.clientWidth;
            const constrainedWidth = Math.min(Math.max(width, (sidebarMinSize / 10) * parentWidth.current.clientWidth), maxWidth);
            setResizableWidth(constrainedWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div id="background" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }} ref={parentWidth}>
            <div
                id="sidebar"
                style={{
                    width: ResizableWidth + "px",
                    overflow: "scroll",
                }}
                ref={resizableElementRef}
            >
                {ResizableSidebar}
            </div>
            <div id="wall" style={{ height: "100%", width: "10px", cursor: "ew-resize" }} onMouseDown={handleMouseDown}>
                {ResizableWall}
            </div>
            <div
                id="main"
                style={{
                    flexGrow: 1,
                    maxWidth: `calc(100% - ${ResizableWidth}px)`,
                    minWidth: `calc(100% - ${ResizableWidth}px)`,
                }}
            >
                {ResizableMain}
            </div>
        </div>
    );
};

export default ResizableGrid;
