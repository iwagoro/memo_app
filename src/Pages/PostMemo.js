import { useState, forwardRef, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { db } from "./Firebase.js";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TextField, Box, Grid, Divider, List, ListItem, Card, CardContent, Paper, IconButton, Menu, MenuItem } from "@mui/material";

import { memoData } from "./Home.js";

const PostData = () => {
    const [FORM_COUNT, SET_FORM_COUNT] = useState(0);
    const [DOC_NAME, SET_DOC_NAME] = useState();
    const { register, handleSubmit, control } = useForm();
    const { fields, append, remove } = useFieldArray({ control, name: "TEXTFIELD" });
    const { docObject, setDocObject, docName, setDocName, userInfo, setUserInfo } = useContext(memoData);

    useEffect(() => {
        console.log(docName);
        SET_ALL_FORM();
    }, [docName]);

    const SET_ALL_FORM = () => {
        SET_DOC_NAME(docName);
        //フォームを全部消して初期化
        for (let i = 0; i < FORM_COUNT; i++) {
            remove(0);
            SET_FORM_COUNT((prevState) => prevState - 1);
        }
        //新しくフォームを作成
        //console.log(docObject)
        Object.keys(docObject).map((value) => {
            //console.log(docObject[value])
            append(docObject[value]);
            SET_FORM_COUNT((prevState) => prevState + 1);
        });
    };

    const ADD_FORM = () => {
        append({ key: "", value: "" });
        SET_FORM_COUNT((prevState) => prevState + 1);
    };

    const REMOVE_FORM = (index) => {
        remove(index);
        SET_FORM_COUNT((prevState) => prevState - 1);
    };

    const REMOVE_ALL_FORM = async (e) => {
        console.log(DOC_NAME);
        if (DOC_NAME !== "") {
            window.location.reload();
            await deleteDoc(doc(db, "User",userInfo.email,"Memos", DOC_NAME));
        }
    };

    const POST_DOC = async (e) => {
        let DOC_DATA = {};
        const name = document.getElementById("main_textfield").value;
        e.TEXTFIELD.forEach((value) => {
            value.key !== "" && (DOC_DATA[value.key] = value.value);
        });

        if (name !== "") {
            await setDoc(doc(db, "User", userInfo.email, "Memos", name), DOC_DATA);
            window.location.reload();
        }
    };

    return (
        <Box sx={{ width: "90%" }}>
            <List sx={{ overflow: "scroll", width: "100%" }}>
                <ListItem sx={{ padding: "3%" }}>
                    <Grid container direction={"row"} flexWrap={"nowrap"}>
                        <TextField
                            focused
                            variant="standard"
                            label="Document Name"
                            id="main_textfield"
                            tabIndex={0}
                            color="primary"
                            sx={{ width: "70%" }}
                            onKeyDown={(e) => {
                                e.key === "Tab" && ADD_FORM();
                            }}
                            value={DOC_NAME ? DOC_NAME : ""}
                            onChange={(e) => SET_DOC_NAME(e.target.value)}
                        />
                        <IconButton disableRipple onClick={ADD_FORM} tabIndex={-1} sx={{ paddingLeft: "7%" }}>
                            <AddIcon />
                        </IconButton>

                        <IconButton disableRipple onClick={handleSubmit(POST_DOC)} tabIndex={-1} sx={{ paddingLeft: "7%" }}>
                            <CheckIcon />
                        </IconButton>

                        <IconButton
                            disableRipple
                            onClick={(e) => {
                                REMOVE_ALL_FORM(e);
                            }}
                            tabIndex={-1}
                            sx={{ paddingLeft: "7%" }}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Grid>
                </ListItem>
                <Divider variant="fullWidth" sx={{ bgcolor: "primary.main" }} />

                {fields.map((field, index) => (
                    <ListItem sx={{ padding: "3%" }}>
                        <Grid container direction={"row"}>
                            <Grid item xs={5}>
                                <TextField
                                    variant="standard"
                                    label="key"
                                    {...register(`TEXTFIELD[${index}].key`)}
                                    sx={{
                                        width: "80%",
                                    }}
                                    color="primary"
                                    focused
                                />
                            </Grid>

                            <Grid item xs={5}>
                                <TextField
                                    variant="standard"
                                    label="value"
                                    {...register(`TEXTFIELD[${index}].value`)}
                                    sx={{
                                        width: "80%",
                                    }}
                                    color="primary"
                                    focused
                                    onKeyDown={(e) => {
                                        e.key === "Tab" && ADD_FORM();
                                    }}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <IconButton onClick={() => REMOVE_FORM(index)} tabIndex={-1}>
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default PostData;
