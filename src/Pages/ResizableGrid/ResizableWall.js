import React, { useState, useRef } from "react";
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";


const ResizableWallContainer = styled.div`
  ${(props) => props.styles}
`;


const ResizableWall = ({ children, sx }) => {
  const styles = css(sx);
  return <ResizableWallContainer styles={styles}>{children}</ResizableWallContainer>;
};


export default ResizableWall ;
