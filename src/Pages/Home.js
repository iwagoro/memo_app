import { createContext, useEffect, useState, useRef } from "react";
import { Drawer, Card, Grid, Box, List, ListItem, IconButton, Typography, Divider, Icon, TextareaAutosize, AppBar, Toolbar, Avatar } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import Memo from "./Memo";
import WindowIcon from "@mui/icons-material/Window";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import Note from "./Note";
import Storage from "./Storage";
import StorageView from "./StorageView.js";
import PostMemo from "./PostMemo.js";
import PostNote from "./PostNote.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMedia from "use-media";
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { db, auth, provider } from "./Firebase";
import { collection, getDoc, where, query, doc, setDoc, addDoc, add } from "firebase/firestore";

export const memoData = createContext();
export const imageData = createContext();

const theme = createTheme({
    typography: {
        fontFamily: "DM Sans",
        fontSize: 16,
    },
    palette: {
        primary: {
            main: "#898989",
        },
        secondary: {
            main: "#FFFFFF",
        },
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "gray",

                    "&:hover": {
                        color: "#ff8c00 ", // ホバー時の背景色を指定
                    },
                    "&:focus": {
                        color: "#ff8c00 ",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "white ",
                    },
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: "#121212",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: "gray",
                    borderBottom: "none",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: "17px",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    color: "gray",
                },
            },
        },
    },
});

const Home = () => {
    const [functionSelect, setFunctionSelect] = useState(-1);
    const [docObject, setDocObject] = useState([]);
    const [docName, setDocName] = useState("");
    const isWide = useMedia({ minWidth: "700px" });
    const resizableElementRef = useRef(null);
    const [resizableWidth, setResizableWidth] = useState(300);
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const VALUE = {
        docObject,
        setDocObject,
        docName,
        setDocName,
        userInfo,
        setUserInfo,
    };
    const [imageURL, setImageURL] = useState("");
    const VALUE2 = {
        imageURL,
        setImageURL,
        resizableWidth,
    };

    useEffect(() => {
        const setAsyncUserInfo = (value) => {
            return new Promise((resolve) => {
                setUserInfo(value, () => {
                    resolve();
                });
            });
        };

        setDocObject([]);
        setDocName("");
        setAsyncUserInfo(auth.currentUser);
        console.log(auth.currentUser)
    }, [functionSelect]);

    const handleMouseDown = (event) => {
        const startX = event.pageX;

        const handleMouseMove = (event) => {
            const width = resizableWidth + (event.pageX - startX);
            const maxWidth = 0.6 * window.innerWidth; // 60vw の最大値
            const constrainedWidth = Math.min(Math.max(width, 0.2 * window.innerWidth), maxWidth);
            console.log(constrainedWidth);
            setResizableWidth(constrainedWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const logout = () => {
        signOut(auth, provider);
    };

    return (
        <ThemeProvider theme={theme}>
            <div id="background" style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
                {isWide ? (
                    <Grid id="app" container direction="row" sx={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#000000" }}>
                        <div id="sidebar" style={{ width: resizableWidth + "px", maxHeight: "100vh", minWidth: "10vw", maxWidth: "60vw", overflow: "scroll" }} ref={resizableElementRef}>
                            <Card id="title" sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vh 0 1vh 1vw" }}>
                                <List>
                                    <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                        <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={logout}>
                                            <WindowIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Dash Board
                                        </IconButton>
                                    </ListItem>
                                </List>
                            </Card>
                            <Card id="title" sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vh 0 1vh 1vw" }}>
                                <List>
                                    <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                        <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(0)}>
                                            <DataObjectIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Data Base
                                        </IconButton>
                                    </ListItem>
                                    <ListItem>
                                        <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(1)}>
                                            <BorderColorOutlinedIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Note Book
                                        </IconButton>
                                    </ListItem>
                                    <ListItem>
                                        <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(2)}>
                                            <StorageIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Storage
                                        </IconButton>
                                    </ListItem>
                                </List>
                            </Card>
                            <Card id="select" sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vh 0 1vh 1vw" }}>
                                {functionSelect === -1 && <div></div>}
                                {functionSelect === 0 && (
                                    <memoData.Provider value={VALUE}>
                                        <Memo />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 1 && (
                                    <memoData.Provider value={VALUE}>
                                        <Note />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 2 && (
                                    <imageData.Provider value={VALUE2}>
                                        <Storage />
                                    </imageData.Provider>
                                )}
                            </Card>
                        </div>
                        <div id="wall" style={{ height: "100%", width: "1vw", cursor: "ew-resize" }} onMouseDown={handleMouseDown}></div>
                        <div
                            id="main"
                            style={{
                                flexGrow: 1,
                                maxWidth: `calc(98vw - ${resizableWidth}px)`,
                                minWidth: `calc(98vw - ${resizableWidth}px)`,
                            }}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "1vh 1vw 1vh 0",
                                    height: "99vh",
                                    width: "100%",
                                    overflow: "scroll",
                                    background: " linear-gradient(170deg, rgba(255, 140, 0, 0.4) 0%, rgba(0, 0, 0, 0.38) 100%) ",
                                }}
                            >
                                {functionSelect === 0 && (
                                    <memoData.Provider value={VALUE}>
                                        <PostMemo />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 1 && (
                                    <memoData.Provider value={VALUE}>
                                        <PostNote />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 2 && (
                                    <imageData.Provider value={VALUE2}>
                                        <StorageView />
                                    </imageData.Provider>
                                )}
                            </Card>
                        </div>
                    </Grid>
                ) : (
                    <Grid id="app" container direction="column" sx={{ width: "100%", height: "100%", backgroundColor: "#000000" }}>
                        <AppBar position="static" sx={{ backgroundColor: "black" }}>
                                <Card sx={{ display: 'flex', backgroundColor: "#121212", margin: "1vh 1vw 0vh 1vw" }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <IconButton disableRipple onClick={() => setOpen(true)}>
                                            <LinearScaleIcon fontSize="large" />
                                        </IconButton>
                                        <IconButton disableRipple>
                                            <Avatar src={userInfo.photoURL} sx={{ width: '20px', height: '20px' }} />
                                        </IconButton>
                                    </Box>
                                </Card>
                        </AppBar>
                        <Drawer
                            anchor={"left"}
                            open={open}
                            onClose={() => {
                                setOpen(false);
                            }}
                            PaperProps={{
                                sx: {
                                    backgroundColor: "#121212",
                                    maxWidth: "50vw",
                                },
                            }}
                        >
                            <List>
                                <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(0)}>
                                        <WindowIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Dash Board
                                    </IconButton>
                                </ListItem>
                                <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(0)}>
                                        <DataObjectIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Data Base
                                    </IconButton>
                                </ListItem>
                                <ListItem>
                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(1)}>
                                        <BorderColorOutlinedIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Note Book
                                    </IconButton>
                                </ListItem>
                                <ListItem>
                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(2)}>
                                        <StorageIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Storage
                                    </IconButton>
                                </ListItem>

                                {functionSelect === 0 && (
                                    <memoData.Provider value={VALUE}>
                                        <Memo />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 1 && (
                                    <memoData.Provider value={VALUE}>
                                        <Note />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 2 && (
                                    <imageData.Provider value={VALUE2}>
                                        <Storage />
                                    </imageData.Provider>
                                )}
                            </List>
                        </Drawer>

                        <div id="main" style={{ flexGrow: 1, maxWidth: "98vw" }}>
                            <Card
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "1vh 1vw 1vh 1vw",
                                    height: "90vh",
                                    width: "100%",
                                    background: " linear-gradient(170deg,  rgba(255, 140, 0, 0.4) 0%, rgba(0, 0, 0, 0.38) 100%) ",
                                    overflow: "scroll",
                                }}
                            >
                                {functionSelect === 0 && (
                                    <memoData.Provider value={VALUE}>
                                        <PostMemo />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 1 && (
                                    <memoData.Provider value={VALUE}>
                                        <PostNote />
                                    </memoData.Provider>
                                )}
                                {functionSelect === 2 && (
                                    <imageData.Provider value={VALUE2}>
                                        <StorageView />
                                    </imageData.Provider>
                                )}
                            </Card>
                        </div>
                    </Grid>
                )}
            </div>
        </ThemeProvider>
    );
};

export default Home;
