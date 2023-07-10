import { createContext, useEffect, useState, useRef } from "react";
import { Button, Drawer, Card, Grid, Box, List, ListItem, IconButton, Typography, Divider, Icon, TextareaAutosize, AppBar, Toolbar, TextField } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import Memo from "./Memo";
import WindowIcon from "@mui/icons-material/Window";
import GoogleIcon from "@mui/icons-material/Google";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
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

const theme = createTheme({
    palette: {
        primary: {
            main: "#898989",
        },
        secondary: {
            main: "#ff8c00",
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "white ",
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: "25px",
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    color: "white",
                },
            },
        },
    },
});

const Login = () => {
    const isWide = useMedia({ minWidth: "850px" });

    const clickLogin = () => {
        signInWithPopup(auth, provider)
            .then((info) => {
                console.log("workd");
                console.log(info);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <div id="background" style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {isWide ? (
                    <Card id="title" sx={{ width: "500px", backgroundColor: "#121212", margin: "5vh 5vw 5vh 5vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <List sx={{ justifyContent: "center", width: "80%", alignItems: "center", padding: "4vh" }}>
                            <h1 style={{ color: "white", textAlign: "center" }}>Memo_Appにログイン</h1>
                            <ListItem
                                sx={{
                                    width: "320px",
                                    cursor: "pointer",
                                    margin: "7vh auto",
                                    border: "0.4px solid gray",
                                    borderRadius: "20px",
                                    "&:hover": { backgroundColor: "#343434", borderColor: "white" },
                                }}
                                onClick={clickLogin}
                            >
                                <GoogleIcon fontSize="small" sx={{ color: "white", position: "fixed" }} />
                                <span style={{ width: "100%", color: "white", textAlign: "center" }}>Googleでログイン</span>
                            </ListItem>
                            <Divider sx={{ borderColor: "gray", margin: "5vh 0" }} />
                            <h4 style={{ color: "white", textAlign: "center" }}>または、メールアドレス</h4>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="メールアドレス" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="パスワード" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }}>
                                    <h4>ログイン</h4>
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                ) : (
                    
                        <List sx={{ justifyContent: "center", width: "80%", alignItems: "center", padding: "4vh" }}>
                            <h2 style={{ color: "white", textAlign: "center" }}>Memo_Appにログイン</h2>
                            <ListItem
                                sx={{
                                    width: "320px",
                                    cursor: "pointer",
                                    margin: "7vh auto",
                                    border: "0.4px solid gray",
                                    borderRadius: "20px",
                                    "&:hover": { backgroundColor: "#343434", borderColor: "white" },
                                }}
                                onClick={clickLogin}
                            >
                                <GoogleIcon fontSize="small" sx={{ color: "white", position: "fixed" }} />
                                <span style={{ width: "100%", color: "white", textAlign: "center" }}>Googleでログイン</span>
                            </ListItem>
                            <Divider sx={{ borderColor: "gray", margin: "5vh 0" }} />
                            <h4 style={{ color: "white", textAlign: "center" }}>または、メールアドレス</h4>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="メールアドレス" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="パスワード" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }}>
                                    <h4>ログイン</h4>
                                </Button>
                            </ListItem>
                        </List>
                )}
            </div>
        </ThemeProvider>
    );
};
export default Login;
