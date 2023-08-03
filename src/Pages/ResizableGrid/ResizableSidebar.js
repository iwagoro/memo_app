import React, { useState, useRef } from "react";
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";


const ResizableSidebarContainer = styled.div`
  ${(props) => props.styles}
`;


const ResizableSidebar = ({ children, sx }) => {
  const styles = css(sx);
  return <ResizableSidebarContainer styles={styles}>{children}</ResizableSidebarContainer>;
};


export default ResizableSidebar ;
