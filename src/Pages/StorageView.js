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

const StorageView = () => {
    const fileRef = useRef(null);
    const root = "gs://react-test-34de3.appspot.com";
    const [tableData, setTableData] = useState([]);
    const [directory, setDirectory] = useState(root);
    const [metadata, setMetadata] = useState({});
    const { imageURL, setImageURL, resizableWidth } = useContext(imageData);

    useEffect(() => {
        setImageURL("");
        setTableData([]);
        GET_DIRECTRY(root);
    }, []);

    const GET_DIRECTRY = async (directory) => {
        console.log(directory);
        const storageRef = ref(st, directory);
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
        <Box sx={{ width: "100%", backgroundColor: "#121212" }}>
            {imageURL !== "" ? (
                <Box sx={{ padding: "1vw 1vw 1vw 1vw", boxSizing: "border-box", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img src={imageURL} style={{ maxWidth: "100%", maxHeight: "50vh", borderRadius: "4px" }} />
                </Box>
            ) : (
                <></>
            )}
        </Box>
    );
};

export default StorageView;
