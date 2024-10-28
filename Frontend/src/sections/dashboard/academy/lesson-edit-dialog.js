import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from "@mui/material"
import { use, useCallback, useState } from "react"
import toast from "react-hot-toast"
import { exploreApi } from "../../../api/explore"
import { paths } from "../../../paths"
import { setLazyProp } from "next/dist/server/api-utils"
import { FileDropzoneVn } from "../../../components/file-dropzone-vn"

export const LessonEditDialog = (props) => {
    const {topicIndex, lessonId, lessonTitle, open, setEditDialog, setTopicList} = props
    const [tempTitle, setTempTitle] = useState(lessonTitle)
    const [disabled, setDisabled] = useState(false);
    const [files, setFiles] = useState([]);

    const handleEditLesson = useCallback(async () => {
        try {
            await exploreApi.updateLesson(lessonId, {title: tempTitle});
            setTopicList(prev => {
                prev[topicIndex].lessons.forEach(lesson => {
                    if (lesson.id === lessonId) lesson.title = tempTitle;
                })
                
                return prev
            })
            toast.success("Đã đổi tên tài liệu học thành công")
            setEditDialog(false)
        }
        catch (error){
            toast.error("Xảy ra lỗi")
        }
    }, [topicIndex, lessonId, tempTitle])

    // const handleFilesDrop = useCallback((newFiles) => {
    // console.log(newFiles)
    // setFiles((prevFiles) => {
    //     return [...prevFiles, ...newFiles];
    //     });
    //     setDisabled(false);
    // }, []);

    // const handleFileRemove = useCallback((file) => {
    //     setFiles((prevFiles) => {
    //     return prevFiles.filter((_file) => _file.path !== file.path);
    //     });
    //     setDisabled(false);
    // }, []);

    // const handleFilesRemoveAll = useCallback(() => {
    //     setFiles([]);
    //     setDisabled(false);
    // }, []);

    // const handleFilesUpload = async (event) => {
    //     event.preventDefault();
    //     const formData = new FormData();
    //     formData.append('file', files[0]);
    //     try {
    //         // NOTE: Make API request
    //         // console.log(formik.values);
    //         // console.log(files.map((_file) => _file.path))
    //         const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files`,
    //             formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         setIdLMList([response.data["id"]])
    //         setDisabled(true);
    //         toast.success('File đã đăng tải thành công');
    //         // router.push(`${paths.dashboard.explore}/course`);
    //     } catch (err) {
    //         console.error(err);
    //         toast.error('Something went wrong!');
    //         console.error('Error uploading file:', err);
    //     }
    // };


    return (
        <Dialog
            fullWidth
            open={open}
            onClose={() => setEditDialog(0)}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault()
                    handleEditLesson()
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">
                {`Tên mới cho tài liệu học "${lessonTitle}"`}
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
                {/* Tiêu đề tài liệu học */}
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    fullWidth
                    variant="standard"
                    value={tempTitle}
                    onChange={(event) => setTempTitle(event.target.value)}
                />
            </DialogContent>
            {/* <DialogContent>
                <Stack marginTop={3}>
                    <DialogContentText id="alert-dialog-description">
                        Cập nhật tài liệu
                    </DialogContentText>
                    <Grid>
                        <FileDropzoneVn
                            accept={{ 'application/pdf': [] }}
                            caption="Chấp nhận file PDF"
                            files={files}
                            disabled={disabled}
                            onDrop={handleFilesDrop}
                            onRemove={handleFileRemove}
                            onRemoveAll={handleFilesRemoveAll}
                            onUpload={handleFilesUpload}
                        />
                    </Grid>
                </Stack>
            </DialogContent> */}
            <DialogActions>
                <Button onClick={() => setEditDialog(0)}>Huỷ bỏ</Button>
                <Button type="submit">
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    )
}