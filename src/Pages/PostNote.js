import { useState, useEffect, useContext } from "react";
import { db } from "./Firebase.js";
import { setDoc, doc,onSnapshot, collection } from "firebase/firestore";
import { List, Box, ListItem, IconButton, TextareaAutosize } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { memoData } from "./Home.js";

const PostNote = () => {
    const [date, setDate] = useState({});
    const [NOTE_NAME, SET_NOTE_NAME] = useState("");
    const [NOTE, SET_NOTE] = useState("");
    const { docObject, docName, userInfo, setUserInfo } = useContext(memoData);

    useEffect(() => {
        setDate(getDate());
        
    }, []);

    useEffect(()=>{
        const result = onSnapshot( doc(db,'User',userInfo.email),docSnap => {
            console.log(docSnap)
        } )
        
    },[NOTE_NAME])

    useEffect(() => {
        SET_ALL_NOTE();
        
    }, [docName]);

    const SET_ALL_NOTE = () => {
        SET_NOTE_NAME(docName);
        SET_NOTE(docObject.content);
    };

    const getDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear(); // 年
        const month = currentDate.getMonth() + 1; // 月 (0から始まるため +1)
        const day = currentDate.getDate(); // 日

        return { year: year, month: month, day: day };
    };

    const POST_NOTE = async (e) => {

        if (NOTE_NAME !== "") {
            await setDoc(doc(db, "User", userInfo.email, "Notes", NOTE_NAME), {
                content: NOTE,
                edited_date: date,
            });
            window.location.reload();
        }
    };

    return (
        <Box sx={{ width: "90%" }}>
            <List sx={{ width: "100%", overflow: "scroll" }}>
                <ListItem id="head" sx={{ width: "90%", color: "gray" }}></ListItem>
                <ListItem sx={{ width: "90%", color: "gray", fontSize: "13px" }}>
                    title
                    <div style={{ position: "absolute", right: "1px" }}>
                        <IconButton disableFocusRipple disableTouchRipple onClick={POST_NOTE}>
                            <CheckIcon />
                        </IconButton>
                    </div>
                </ListItem>
                <ListItem id="title">
                    <TextareaAutosize
                        value={NOTE_NAME ? NOTE_NAME : ""}
                        onChange={(e) => {
                            SET_NOTE_NAME(e.target.value);
                        }}
                        style={{
                            width: "90%",
                            fontSize: "200%",
                            fontFamily: "DM Sans",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            resize: "none",
                            color: "white",
                        }}
                    />
                </ListItem>
                <ListItem id="date" sx={{ width: "90%", color: "gray", fontSize: "10px" }}>
                    {`${date.year}年${date.month}月${date.day}日`}
                </ListItem>
                <ListItem id="date" sx={{ width: "90%", color: "gray", fontSize: "13px" }}>
                    content
                </ListItem>
                <ListItem id="main">
                    <TextareaAutosize
                        value={NOTE ? NOTE : ""}
                        onChange={(e) => {
                            SET_NOTE(e.target.value);
                        }}
                        minRows={10}
                        style={{
                            width: "90%",
                            fontSize: "120%",
                            fontFamily: "DM Sans",
                            backgroundColor: "transparent",
                            outline: "none",
                            border: "none",
                            resize: "none",
                            color: "white",
                        }}
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default PostNote;
