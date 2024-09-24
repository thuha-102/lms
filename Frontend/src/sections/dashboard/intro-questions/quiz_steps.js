import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { Button, Card, Radio, Stack, SvgIcon, Typography } from '@mui/material';
import { introQuestionApi } from '../../../api/introQuestion';
import { useRouter } from 'next/router';
import { paths } from '../../../paths';
import { useAuth } from '../../../hooks/use-auth';

export const QuizSteps = (props) => {
  const { questions, ...other } = props;
  const router = useRouter();
  const { user } = useAuth();
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState(questions.map(_ => null));

  if (!user) {
    return null;
  }

  const handleSubmitQuiz = useCallback(async () => {
    try {
      console.log(questions.reduce((accumulator, currentQues, i) => accumulator + currentQues.scores[answers[i]], 0));
      await introQuestionApi.submitIntroQuestionsAnswers({
        "leanerId": user.id,
        "score": questions.reduce((accumulator, currentQues, i) => accumulator + currentQues.scores[answers[i]], 0)
      });
      router.push(paths.dashboard.learningPaths.index);
    } catch (err) {
      console.error(err);
    }
  }, [answers]) 

  return (
    <Stack
      spacing={3}
      {...other}>
      <div>
        <Typography variant="h6">
          Câu {questionIdx + 1}: {questions[questionIdx].question}
        </Typography>
      </div>
      <Stack spacing={2}>
        {questions[questionIdx].answers.map((option, indexValue) => (
          <Card
            key={indexValue}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              p: 2,
              ...(answers[questionIdx] === indexValue && {
                backgroundColor: 'primary.alpha12',
                boxShadow: (theme) => `${theme.palette.primary.main} 0 0 0 1px`
              })
            }}
            onClick={() => {
              setAnswers([...answers.slice(0, questionIdx), indexValue, ...answers.slice(questionIdx + 1)])
            }}
            variant="outlined"
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <Radio
                checked={answers[questionIdx] === indexValue}
                color="primary"
              />
              <div>
                <Typography variant="body2">
                  {option}
                </Typography>
              </div>
            </Stack>
          </Card>
        ))}
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        <Button
          color="inherit"
          onClick={() => setQuestionIdx(pre => pre-1)}
          startIcon={(
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          )}
          disabled={questionIdx === 0}
        >
          Về trước
        </Button>
        <Button
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          onClick={() => setQuestionIdx(pre => pre+1)}
          variant="contained"
          disabled={questionIdx === (questions.length - 1)}
        >
          Tiếp tục
        </Button>
      </Stack>
      {questionIdx === (questions.length - 1) && 
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="center"
      >
        <Button
          onClick={handleSubmitQuiz}
          variant="contained"
          disabled={answers.some(a => a == null)}
        >
          Hoàn thành
        </Button>
      </Stack>}
    </Stack>
  );
};

QuizSteps.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
};
