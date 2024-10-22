import { Card, CardContent, CardMedia, Checkbox, Grid, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { useCallback, useEffect, useState } from "react";
import { FileDropzoneVn } from "../../../../components/file-dropzone-vn";
import toast from "react-hot-toast";
import axios from "axios";

export const QuizQuestion = (props) => {
    const { row, questionIndex, setQuestionnaire } = props
    const [fileId, setFileId] = useState()
    const [images, setImage] = useState([])
    const [preview, setPreview] = useState()
    const [disabled, setDisabled] = useState(false)
    const [question, setQuestion] = useState([])
    const [correctAnswer, setCorrectAnswer] = useState([])
    const [answers, setAnswers] = useState([[]])

    useEffect(() => {
        setQuestion(row[0])
        setCorrectAnswer(`${row[1]}`.toUpperCase().charCodeAt(0) - 65)
        setAnswers(row.slice(2).filter(a => a))
    }, [row])

    useEffect(() => {
        // console.log(questionIndex, question, correctAnswer, answers, fileId)
        setQuestionnaire(prev => {
            if (prev && prev.questions.length > 0) {
                prev.questions[questionIndex] = question
                prev.correctAnswers[questionIndex] = correctAnswer
                prev.answers[questionIndex] = answers
                prev.coverIds[questionIndex] = fileId
            }

            return prev
        })
    }, [fileId, questionIndex, question, correctAnswer, answers])

    const handleFileDrop = useCallback((newFiles) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview([reader.result]);
        };
        reader.readAsDataURL(newFiles[0]);

        setImage(newFiles)
        setDisabled(false);
    }, []);

    const handleFileRemove = useCallback((file) => {
        setImage((prevFiles) => {
            return prevFiles.filter((_file) => _file.path !== file.path);
        });
        setPreview(null)
        setDisabled(false);
    }, []);

    const handleFilesRemoveAll = useCallback(() => {
        setImage([]);
        setDisabled(false);
    }, []);

    const handleFilesUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', images[0]);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/files/avatar`,
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setFileId(response.data["id"])
            setDisabled(true);
            toast.success('File đã đăng tải thành công');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
            console.error('Error uploading file:', err);
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container direction={'row'} alignItems={'center'} justifyContent={'center'}>
                    <Grid
                        lg={7}
                        md={12}
                        minWidth={600}
                        minHeight={300}
                    >
                        <Stack alignItems={'center'}>
                            {
                                preview ?
                                <CardMedia sx={{height: 300, width: 600}} image={preview}/>
                                :
                                <SvgIcon sx={{height: 300, width: 600, border: '1px dashed'}}>
                                    <ImageNotSupportedIcon/>
                                </SvgIcon>
                            }
                        </Stack>
                    </Grid>
                    <Grid>
                        <FileDropzoneVn
                            accept={{'image/*': []}}
                            caption="Hình ảnh minh họa"
                            files={images}
                            disabled={disabled}
                            onDrop={handleFileDrop}
                            onRemove={handleFileRemove}
                            onRemoveAll={handleFilesRemoveAll}
                            onUpload={handleFilesUpload}
                        />
                    </Grid>
                </Grid>
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} marginTop={2}>
                    <Typography variant="h6" width={100}>Câu {questionIndex + 1}: </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        variant="standard"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                    />
                </Stack>
                <Stack spacing={2}>
                    {
                        answers.map((ans, index) => (
                            <Stack key={index} direction={'row'}>
                                <Typography variant="h6" width={100}/>
                                <Checkbox checked={correctAnswer - index === 0 } onClick={() => setCorrectAnswer(index)}/>
                                <TextField                                        
                                    fullWidth
                                    margin="dense"
                                    placeholder={ans}
                                    onChange={(event) => setAnswers(prev => {prev[index] = event.target.value; return prev})}
                                />
                            </Stack>
                        ))
                    }
                </Stack>
            </CardContent>
        </Card>
    )
}