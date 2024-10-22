import { Button, Stack} from '@mui/material'
import { useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { QuizQuestion } from './quiz-question'
import { QuizQuestionCreate } from './quiz-question-create'

export const QuizQuestionaire = (props) => {
    const { file, rows, setQuestionnaire, setQuizData} = props
    const [questions, setQuestions] = useState([])
    const [addingQuestion, setAddingQuestion] = useState(false)

    useEffect(() => {
        if (file)
            readXlsxFile(file).then((rows) => {
                setQuestions(rows.slice(1))
                setQuestionnaire(prev => {
                    prev.length = rows.length - 1
                    prev.questions = new Array(rows.length - 1);
                    prev.correctAnswers = new Array(rows.length - 1);
                    prev.coverIds = new Array(rows.length - 1);
                    prev.answers = new Array(rows.length - 1);
                    return prev
                })
            })
        else if (rows){
            setQuestions(rows)
        }
    }, [file, rows])

    useEffect(() => {
        setAddingQuestion(false)
    }, [rows])
    
    return (
        <Stack spacing={2}>
            {
                questions.map((row, index) => (
                    <QuizQuestion key={index} row={row} questionIndex={index} setQuestionnaire={setQuestionnaire}/>
                ))
            }
            {
                addingQuestion && <QuizQuestionCreate questionIndex={questions.length} setAddingQuestion={setAddingQuestion} setQuizData={setQuizData}/>
            }
            <Button
                onClick={() => setAddingQuestion(true)}
                disabled={addingQuestion}
                variant='contained'
            >
                Thêm câu hỏi mới
            </Button>
        </Stack>
    )
}