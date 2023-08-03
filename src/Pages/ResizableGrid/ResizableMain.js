import React, { useState, useRef } from "react";
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";


const ResizableMainContainer = styled.div`
  ${(props) => props.styles}
`;


const ResizableMain = ({ children, sx }) => {
  const styles = css(sx);
  return <ResizableMainContainer styles={styles}>{children}</ResizableMainContainer>;
};


export default ResizableMain ;