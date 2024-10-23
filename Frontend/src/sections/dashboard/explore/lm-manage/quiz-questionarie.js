import { Button, Stack} from '@mui/material'
import { useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { QuizQuestion } from './quiz-question'
import { QuizQuestionCreate } from './quiz-question-create'

export const QuizQuestionaire = (props) => {
    const { file, questionnaire, setQuestionnaire} = props
    const [addingQuestion, setAddingQuestion] = useState(false)

    useEffect(() => {
        if (file)
            readXlsxFile(file).then((rows) => {
                setQuestionnaire(() => rows.slice(1).map(row => [[null], row[0], `${row[1]}`.charCodeAt(0) - 65, ...row.slice(2)]));
            })
    }, [file])
    
    return (
        <Stack spacing={2}>
            {
                questionnaire?.map((row, index) => (
                    <QuizQuestion key={index} row={row} questionIndex={index} setQuestionnaire={setQuestionnaire}/>
                ))
            }
            {
                addingQuestion && <QuizQuestionCreate questionIndex={questionnaire.length} setQuestionnaire={setQuestionnaire} setAddingQuestion={setAddingQuestion}/>
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