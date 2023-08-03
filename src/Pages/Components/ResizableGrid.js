import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";


//◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤//

const ResizableMainContainer = styled.div`
  ${(props) => props.styles}
`;

const ResizableWallContainer = styled.div`
  ${(props) => props.styles}
`;

const ResizableSidebarContainer = styled.div`
  ${(props) => props.styles}
`;

const ResizableMain = ({ children, sx }) => {
    const styles = css(sx);
    return <ResizableMainContainer styles={styles}>{children}</ResizableMainContainer>;
};

const ResizableSidebar = ({ children, sx }) => {
    const styles = css(sx);
    return <ResizableSidebarContainer styles={styles}>{children}</ResizableSidebarContainer>;
};

const ResizableWall = ({ children, sx }) => {
    const styles = css(sx);
    return <ResizableWallContainer styles={styles}>{children}</ResizableWallContainer>;
};

//◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤//


const ResizableGrid = ({ children, sidebarMinSize, sidebarMaxSize }) => {

    const resizableElementRef = useRef(null);
    const parentWidth = useRef(null);
    const [ResizableWidth, setResizableWidth] = useState(0);

    
    useEffect(() => {
        setResizableWidth(parentWidth.current.clientWidth / 2);

       
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
                {React.Children.map(children, child => {if(child.type.name === "ResizableSidebar")  return child})}
            </div>
            <div id="wall" style={{ height: "100%", width: "10px", cursor: "ew-resize" }} onMouseDown={handleMouseDown}>
                {React.Children.map(children, child => { if (child.type.name === "ResizableWall") return child })}
            </div>
            <div
                id="main"
                style={{
                    flexGrow: 1,
                    maxWidth: `calc(100% - ${ResizableWidth}px)`,
                    minWidth: `calc(100% - ${ResizableWidth}px)`,
                }}
            >
                {React.Children.map(children, child => { if (child.type.name === "ResizableMain") return child })}
            </div>
        </div>
    );
};

export {ResizableGrid,ResizableMain,ResizableSidebar,ResizableWall}
