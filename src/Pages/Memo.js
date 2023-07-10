import React, { useEffect, useState, useRef, useContext } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Button, List, ListItem, IconButton, ButtonBase, Box, Grid, Card, Typography, Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import { db } from "./Firebase.js";
import ExploreIcon from "@mui/icons-material/Explore";
import AddIcon from "@mui/icons-material/Add";

import { memoData } from "./Home.js";

function Memo() {
    const { handleSubmit } = useForm();
    const [NOTES_NAME, setNOTES_NAME] = useState([]);
    const { docObject, setDocObject, docName, setDocName, userInfo, setUserInfo } = useContext(memoData);

    useEffect(() => {
        INIT_NOTE();
    }, [userInfo]);

    const INIT_NOTE = async () => {
        setDocName("");
        setDocObject([]);
        const snapshot = await getDocs(collection(db, "User", userInfo.displayName, "Memos"));
        const noteNames = snapshot.docs.map((doc) => doc.id);
        setNOTES_NAME(noteNames);
    };

    const GET_DATA = async (note) => {
        const docSnap = await getDoc(doc(db, "User", userInfo.displayName, "Memos", note));

        if (docSnap.exists()) {
            const noteData = Object.keys(docSnap.data()).map((value) => ({
                key: value,
                value: docSnap.data()[value],
            }));

            setDocObject(noteData);
            setDocName(note);
        } else {
            console.log("err");
        }
    };

    return (
        <List>
            <ListItem sx={{ padding: "0", "&:hover": { backgroundColor: "#232323" } }}>
                <IconButton
                    disableRipple
                    sx={{ padding: "18px", justifyContent: "flex-start", width: "100%", fontFamily: "Inter", fontSize: "15px" }}
                    onClick={() => {
                        INIT_NOTE();
                    }}
                >
                    <AddIcon fontSize="small" sx={{ paddingRight: "1.5vw" }} />
                    new Note
                </IconButton>
            </ListItem>
            {NOTES_NAME.map((note, index) => (
                <ListItem sx={{ padding: "0", "&:hover": { backgroundColor: "#232323" } }}>
                    <IconButton disableRipple sx={{ padding: "18px", justifyContent: "flex-start", width: "100%", fontFamily: "Inter", fontSize: "12px" }} onClick={() => GET_DATA(note)}>
                        <div style={{ paddingLeft: "calc(1.5vw + 17px)" }}>{note}</div>
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );
}

export default Memo;
