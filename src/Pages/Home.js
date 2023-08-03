import { createContext, useEffect, useState, useRef } from "react";
import useMedia from "use-media";
import { signOut } from "firebase/auth";
import { auth, provider } from "./Firebase";

import { Drawer, Card, Grid, Box, List, ListItem, IconButton, AppBar, Avatar, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import DataObjectIcon from "@mui/icons-material/DataObject";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import WindowIcon from "@mui/icons-material/Window";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Memo from "./Memo";
import Note from "./Note";
import Storage from "./Storage";
import StorageView from "./StorageView.js";
import PostMemo from "./PostMemo.js";
import PostNote from "./PostNote.js";

import { ResizableGrid, ResizableMain, ResizableSidebar, ResizableWall } from "./Components/ResizableGrid.js";

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
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: "#121212",
                    color: "gray",
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        color: "white",
                    },
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        color: "white",
                    },
                    padding: "0",
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
        userInfo,
        setUserInfo,
    };

    useEffect(() => {
        console.log('aiueo')
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
        //console.log(auth.currentUser);
    }, [functionSelect]);

    return (
        <ThemeProvider theme={theme}>
            <div id="background" style={{ width: "100vw", height: "100vh" }}>
                {isWide ? (
                    <Grid id="app" container direction="row" sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", backgroundColor: "#000000" }}>
                        <ResizableGrid sidebarMaxSize={5} sidebarMinSize={2}>
                            <ResizableSidebar>
                                <Card  sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vw 0 1vw 1vw" }}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" sx={{ color: "gray" }} />}>
                                            <IconButton disableRipple sx={{ "&:hover": { color: "gray" }, width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                                <WindowIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Dash Board
                                            </IconButton>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List>
                                                <ListItem>
                                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                                        <Avatar src={userInfo.photoURL} sx={{ width: "17px", height: "17px", marginRight: "1.5vw" }} /> Your Account
                                                    </IconButton>
                                                </ListItem>
                                                <ListItem>
                                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                                        <SettingsIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Setting
                                                    </IconButton>
                                                </ListItem>
                                                <ListItem>
                                                    <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => {signOut(auth, provider)}}>
                                                        <LogoutIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Log Out
                                                    </IconButton>
                                                </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Card>
                                <Card  sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vw 0 1vw 1vw" }}>
                                    <List>
                                        <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                            <IconButton disableRipple sx={{ color: functionSelect === 0 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(0)}>
                                                <DataObjectIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Data Base
                                            </IconButton>
                                        </ListItem>
                                        <ListItem>
                                            <IconButton disableRipple sx={{ color: functionSelect === 1 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(1)}>
                                                <BorderColorOutlinedIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Note Book
                                            </IconButton>
                                        </ListItem>
                                        <ListItem>
                                            <IconButton disableRipple sx={{ color: functionSelect === 2 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }} onClick={() => setFunctionSelect(2)}>
                                                <StorageIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Storage
                                            </IconButton>
                                        </ListItem>
                                    </List>
                                </Card>
                                <Card id="select" sx={{ width: "calc(100%-1vw)", backgroundColor: "#121212", margin: "1vw 0 1vw 1vw" }}>
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
                            </ResizableSidebar>
                            <ResizableWall></ResizableWall>
                            <ResizableMain>
                                <Card
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        margin: "1vw 1vw 1vw 0",
                                        height: "calc(100vh -  2vw)",
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
                            </ResizableMain>
                        </ResizableGrid>
                    </Grid>
                ) : (
                    <Grid id="app" container direction="column" sx={{ width: "100%", height: "100%", backgroundColor: "#000000" }}>
                        <AppBar position="static" sx={{ backgroundColor: "black" }}>
                            <Card sx={{ display: "flex", backgroundColor: "#121212", margin: "1vw 1vw 0 1vw" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                    <IconButton disableRipple onClick={() => setOpen(true)}>
                                        <LinearScaleIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton disableRipple>
                                        <Avatar src={userInfo.photoURL} sx={{ width: "20px", height: "20px" }} />
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
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" sx={{ color: "gray" }} />}>
                                        <IconButton disableRipple sx={{ "&:hover": { color: "gray" }, width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                            <WindowIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Dash Board
                                        </IconButton>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List>
                                            <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                                <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                                    <Avatar src={userInfo.photoURL} sx={{ width: "17px", height: "17px", marginRight: "1.5vw" }} /> Your Account
                                                </IconButton>
                                            </ListItem>
                                            <ListItem>
                                                <IconButton disableRipple sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}>
                                                    <SettingsIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Setting
                                                </IconButton>
                                            </ListItem>
                                            <ListItem>
                                                <IconButton
                                                    disableRipple
                                                    sx={{ width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}
                                                    onClick={() => {
                                                        signOut(auth, provider);
                                                    }}
                                                >
                                                    <LogoutIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Log Out
                                                </IconButton>
                                            </ListItem>
                                        </List>
                                    </AccordionDetails>
                                </Accordion>

                                <ListItem sx={{ "&:hover": { backgroundColor: "#232323" } }}>
                                    <IconButton
                                        disableRipple
                                        sx={{ color: functionSelect === 0 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}
                                        onClick={() => setFunctionSelect(0)}
                                    >
                                        <DataObjectIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Data Base
                                    </IconButton>
                                </ListItem>
                                <ListItem>
                                    <IconButton
                                        disableRipple
                                        sx={{ color: functionSelect === 1 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}
                                        onClick={() => setFunctionSelect(1)}
                                    >
                                        <BorderColorOutlinedIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} /> Note Book
                                    </IconButton>
                                </ListItem>
                                <ListItem>
                                    <IconButton
                                        disableRipple
                                        sx={{ color: functionSelect === 2 ? "#ff8c00" : "gray", width: "100%", justifyContent: "flex-start", fontFamily: "Inter", fontSize: "12px" }}
                                        onClick={() => setFunctionSelect(2)}
                                    >
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
