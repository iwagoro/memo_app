import { useState, forwardRef, useImperativeHandle, useEffect, useRef, useContext } from "react";
import { st } from "./Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL, getMetadata, listAll, getStorage } from "firebase/storage";
import { useFieldArray, useForm } from "react-hook-form";
import {
    Checkbox,
    Dialog,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Box,
    Grid,
    Divider,
    Card,
    CardContent,
    Paper,
    IconButton,
    Button,
    TableFooter,
    Icon,
    getDividerUtilityClass,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddIcon from "@mui/icons-material/Add";

import { imageData } from "./Home.js";

const Storage = () => {
    const fileRef = useRef(null);
    const root = "gs://react-test-34de3.appspot.com";
    const [tableData, setTableData] = useState([]);

    const { imageURL, setImageURL, userInfo, setUserInfo } = useContext(imageData);
    const [directory, setDirectory] = useState(root);
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        setImageURL("");
        setTableData([]);
        GET_DIRECTRY(root);
    }, []);

    const UPLOAD_FILE = (e) => {
        const file = e.target.files[0];
        const storageRef = ref(st, directory.slice(33, directory.length) + "/" + userInfo.email + "/" + e.target.files[0].name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("progress :" + progress + "% done");
            switch (snapshot.state) {
                case "paused":
                    console.log("puased");
                case "running":
                    console.log("runnning");
                case "complete":
                    console.log("complete");
                //window.location.reload()
            }
        });
    };

    const onClick = async (e) => {
        const filteredData = tableData.filter((item) => item.name === e.target.textContent);
        console.log(filteredData);
        if (filteredData[0].type === "フォルダ") {
            setDirectory(root + "/" + filteredData[0].name);
            GET_DIRECTRY(root + "/" + filteredData[0].name);
        } else {
            const storageRef = ref(st, directory + "/" + userInfo.email + "/" + filteredData[0].name);
            const url = await getDownloadURL(storageRef).catch((err) => {
                console.log("error", err);
            });
            await setImageURL(url);
            await setMetadata(filteredData[0]);
        }
    };

    const BACK_PAGE = (e) => {
        if (directory === root) {
        } else {
            //console.log(directory)
            let index = 0;
            if (directory.includes("/")) {
                for (let i = directory.length - 1; i >= 0; i--) {
                    if (directory[i] === "/") {
                        index = i;
                        break;
                    }
                }
                //console.log(directory.slice(0, index))
            }
            setDirectory(directory.slice(0, index));
            //console.log(directory.slice(0,index))
            GET_DIRECTRY(directory.slice(0, index));
        }
    };

    const GET_DIRECTRY = async (directory) => {
        const storageRef = ref(st, directory + "/" + userInfo.email);
        const tableData = [];

        try {
            const res = await listAll(storageRef);

            const itemPromises = res.items.map((itemRef) => {
                return getMetadata(itemRef)
                    .then((metadata) => {
                        const name = metadata.name;
                        const size = metadata.size;
                        const type = metadata.contentType;
                        const time = metadata.updated;
                        tableData.push({ name: name, size: size, type: type, lasdModified: time });
                    })
                    .catch((error) => {
                        console.log("Error retrieving metadata:", error);
                    });
            });

            const folderPromises = res.prefixes.map((folderRef) => {
                tableData.push({ name: folderRef._location.path, size: "", type: "フォルダ", lasdModified: "" });
            });

            await Promise.all([...itemPromises, ...folderPromises]);

            setTableData(tableData);
        } catch (err) {
            console.log("Error retrieving metadata:", err);
        }
    };

    return (
        <Box
            onChange={(e) => {
                console.log(e.target.clientWidth);
            }}
        >
            <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton onClick={BACK_PAGE}>
                                    <KeyboardArrowLeftIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <IconButton
                                    variant="outlined"
                                    onClick={() => {
                                        fileRef.current.click();
                                    }}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                                <input ref={fileRef} onChange={UPLOAD_FILE} type="file" style={{ display: "none" }}></input>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontSize: "10px" }}>名前</TableCell>
                            <TableCell sx={{ fontSize: "10px" }}>サイズ</TableCell>
                            <TableCell sx={{ fontSize: "10px" }}>種類</TableCell>
                        </TableRow>
                        {tableData.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "#232323",
                                    },
                                }}
                            >
                                <TableCell sx={{ width: "100%" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <IconButton disableTouchRipple onClick={onClick} sx={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "#gray" }}>
                                            <div style={{ paddingRight: "1.5vw" }}>{item.type === "フォルダ" ? <FolderOpenIcon fontSize="small" /> : <ImageIcon fontSize="small" />}</div>
                                            {item.name}
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ fontSize: "10px" }}>{item.size}</TableCell>
                                <TableCell sx={{ fontSize: "10px" }}>{item.type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Storage;
