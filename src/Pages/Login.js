import { createContext, useEffect, useState, useRef } from "react";
import { Modal, Button, Drawer, Card, Grid, Box, List, ListItem, IconButton, Typography, Divider, Icon, TextareaAutosize, AppBar, Toolbar, TextField, Menu, Dialog } from "@mui/material";
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
import { useForm } from "react-hook-form";
import PostNote from "./PostNote.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMedia from "use-media";
import { signInWithPopup, GoogleAuthProvider, signInWithRedirect, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db, auth, provider, actionCodeSettings } from "./Firebase";
import { collection, getDoc, where, query, doc, setDoc, addDoc, add ,deleteDoc} from "firebase/firestore";

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
    const { register, getValues } = useForm();
    const [onClose, setOnClose] = useState(false);
    const [isErr, setIsErr] = useState(0);

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

    const emailLogin = () => {
        const values = getValues();

        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                // ログインが成功した場合の処理
                const user = userCredential.user;
                console.log(user);
                window.location.reload();
            })
            .catch((error) => {
                // ログインが失敗した場合の処理
                setIsErr(1);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    const emailRegister = () => {

        const createRepository = async email => {
            await setDoc(doc(collection(db, 'User', email, 'Memos'), 'test'), {})
            await setDoc(doc(collection(db, 'User', email, 'Notes'), 'test'), {})
            await deleteDoc(doc(db, "User",email,"Memos", 'test'));
            await deleteDoc(doc(db, "User",email,"Notes", 'test'));

            
        }

        const values = getValues();
        createUserWithEmailAndPassword(auth, values.registerEmail, values.registerPassword)
            .then((userCredential) => {
                // アカウント作成が成功した場合の処理
                const user = userCredential.user;
                
                console.log("新しいユーザーアカウントが作成されました:", user);
                // 他の処理を追加するか、リダイレクトなどの操作を行う
                createRepository(user.email)
            })
            .catch((error) => {
                // アカウント作成が失敗した場合の処理
                switch (error.code) {
                    case "auth/invalid-email":
                        setIsErr(2);
                        break;
                    case "auth/email-already-in-use":
                        setIsErr(3);
                        break;
                    case "auth/weak-password":
                        setIsErr(4);
                        break;
                    case "auth/missing-password":
                        setIsErr(5);
                        break;
                    default:
                        console.log(error.code);
                }
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
                            {isErr === 1 && <p style={{ color: "red", textAlign: "center" }}>メールアドレスもしくはパスワードが違います</p>}
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="メールアドレス" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} {...register("email")} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <TextField focused variant="standard" label="パスワード" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} {...register("password")} />
                            </ListItem>
                            <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }} onClick={emailLogin}>
                                    <h4>ログイン</h4>
                                </Button>
                            </ListItem>
                            <Divider sx={{ borderColor: "gray", margin: "5vh 0" }} />
                            <p style={{ color: "white", fontSize: "15px", textAlign: "center" }}>
                                アカウントをお持ちではない場合は　
                                <a
                                    style={{ textDecoration: "underline" }}
                                    onClick={() => {
                                        setOnClose(true);
                                        setIsErr(0);
                                    }}
                                >
                                    新規登録する
                                </a>
                            </p>
                            <Modal
                                open={onClose}
                                onClose={() => {
                                    setOnClose(false);
                                    setIsErr(0);
                                }}
                                sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}
                            >
                                <Card sx={{ height: "40vh", width: "500px", backgroundColor: "#121212", margin: "5vh 5vw 5vh 5vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <List>
                                        <h4 style={{ color: "white", textAlign: "center" }}>新規登録</h4>
                                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                            <TextField
                                                focused
                                                variant="standard"
                                                label="メールアドレス"
                                                id="main_textfield"
                                                tabIndex={0}
                                                color="primary"
                                                sx={{ width: "320px" }}
                                                {...register("registerEmail")}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                            <TextField
                                                focused
                                                variant="standard"
                                                label="パスワード"
                                                id="main_textfield"
                                                tabIndex={0}
                                                color="primary"
                                                sx={{ width: "320px" }}
                                                {...register("registerPassword")}
                                            />
                                        </ListItem>
                                        {isErr === 2 && <p style={{ color: "red", textAlign: "center" }}>不正なメールアドレスです</p>}
                                        {isErr === 3 && <p style={{ color: "red", textAlign: "center" }}>そのメールアドレスは登録済みです</p>}
                                        {isErr === 4 && <p style={{ color: "red", textAlign: "center" }}>複雑なパスワードを設定してください</p>}
                                        {isErr === 5 && <p style={{ color: "red", textAlign: "center" }}>パスワードを入力してください</p>}
                                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                            <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }} onClick={emailRegister}>
                                                <h4>ログイン</h4>
                                            </Button>
                                        </ListItem>
                                    </List>
                                </Card>
                            </Modal>
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
                        {isErr === 1 && <p style={{ color: "red", textAlign: "center" }}>メールアドレスもしくはパスワードが違います</p>}
                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                            <TextField focused variant="standard" label="メールアドレス" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} {...register("email")} />
                        </ListItem>
                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                            <TextField focused variant="standard" label="パスワード" id="main_textfield" tabIndex={0} color="primary" sx={{ width: "320px" }} {...register("password")} />
                        </ListItem>
                        <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                            <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }} onClick={emailLogin}>
                                <h4>ログイン</h4>
                            </Button>
                        </ListItem>
                        <Divider sx={{ borderColor: "gray", margin: "5vh 0" }} />
                        <p style={{ color: "white", fontSize: "15px", textAlign: "center" }}>
                            アカウントをお持ちではない場合は　
                            <a
                                style={{ textDecoration: "underline" }}
                                onClick={() => {
                                    setOnClose(true);
                                    setIsErr(false);
                                }}
                            >
                                新規登録する
                            </a>
                        </p>
                        <Modal
                            open={onClose}
                            onClose={() => {
                                setOnClose(false);
                            }}
                            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" }}
                        >
                            <Card sx={{ height: "40vh", width: "500px", backgroundColor: "#121212", margin: "5vh 5vw 5vh 5vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <List>
                                    <h4 style={{ color: "white", textAlign: "center" }}>新規登録</h4>
                                    <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                        <TextField
                                            focused
                                            variant="standard"
                                            label="メールアドレス"
                                            id="main_textfield"
                                            tabIndex={0}
                                            color="primary"
                                            sx={{ width: "320px" }}
                                            {...register("registerEmail")}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                        <TextField
                                            focused
                                            variant="standard"
                                            label="パスワード"
                                            id="main_textfield"
                                            tabIndex={0}
                                            color="primary"
                                            sx={{ width: "320px" }}
                                            {...register("registerPassword")}
                                        />
                                    </ListItem>
                                    {isErr === 2 && <p style={{ color: "red", textAlign: "center" }}>不正なメールアドレスです</p>}
                                    {isErr === 3 && <p style={{ color: "red", textAlign: "center" }}>そのメールアドレスは登録済みです</p>}
                                    {isErr === 4 && <p style={{ color: "red", textAlign: "center" }}>複雑なパスワードを設定してください</p>}
                                    {isErr === 5 && <p style={{ color: "red", textAlign: "center" }}>パスワードを入力してください</p>}
                                    <ListItem sx={{ margin: "2vh auto", justifyContent: "center" }}>
                                        <Button variant="contained" color="secondary" sx={{ height: "40px", width: "320px", borderRadius: "20px" }} onClick={emailRegister}>
                                            <h4>ログイン</h4>
                                        </Button>
                                    </ListItem>
                                </List>
                            </Card>
                        </Modal>
                    </List>
                )}
            </div>
        </ThemeProvider>
    );
};
export default Login;
