import { useCallback, useMemo, useState, useEffect } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Box, Button, Card, CardContent, CardMedia, CircularProgress, Stack, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from '@mui/material';
import { JobCategoryStep } from '././././question/preview_category_step';
import { JobPreview } from '././././question/preview_question_result';
import { useMounted } from '../../../../hooks/use-mounted';
import { lm_manageApi } from '../../../../api/lm-manage';

const StepIcon = (props) => {
    const { active, completed, icon } = props;
  
    const highlight = active || completed;
  
    return (
      <Avatar
        sx={{
          height: 40,
          width: 40,
          ...(highlight && {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText'
          })
        }}
        variant="rounded"
      >
        {completed
          ? (
            <SvgIcon>
              <CheckIcon />
            </SvgIcon>
          )
          : icon}
      </Avatar>
    );
  };
  
  export const PreviewQuestion = (props) => {
    const { lessonId, lmId, user } = props;
    const isMounted = useMounted();
    const [activeStep, setActiveStep] = useState(0);
    const [complete, setComplete] = useState(false);
    const result = {
      duration : 300,
      questions : [
          "What is Data mining?",
          "What is Data mining?"
      ],
      choices : [
          [
              "Just a subject",
              "A Science",
              "Get value information from data"
          ],
          [
              "Just a",
              "A",
              "Get value information from data",
              "BBBBB"
          ]
      ],
      correctAnswers: [
          0,
          1
      ]
      }
    
    const [duration, setDuration] = useState(0)
    const [minutes, setMinutes] = useState("00")
    const [seconds, setSeconds] = useState("00")
    const [startQuiz, setStartQuiz] = useState(false)

    const [resultDT, setResultDT] = useState([{
      questions: [],
      choices: []
    }])
  
    useEffect(() => {
      const fetchData = async (id) => {
        try {
          const response = await lm_manageApi.get1Lm(id);
          
          if (isMounted()) {
            const temp = Object.entries(response.data)
            setDuration(temp[0][1])
            setMinutes(temp[0][1])
            setResultDT(temp.slice(1))
          }
        } catch (err) {
          console.error(err);
        }
      };
    
      fetchData(lmId);
    }, []);
  
    const [answers, setAnswers] = useState([])

    useEffect(() => {
      if (resultDT[1] && resultDT[1].length > 1) setAnswers(new Array(resultDT[1][1]?.length))
    }, [resultDT]);
  
    const handleNext = useCallback(() => {
      setActiveStep((prevState) => prevState + 1);
    }, []);
  
    const handleBack = useCallback(() => {
      setActiveStep((prevState) => prevState - 1);
    }, []);
  
    const handleComplete = useCallback(() => {
      setComplete(true);
    }, []);
  
    const updateAnswer = (index, newAnswer) => {
      setAnswers(prevAnswers => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[index] = newAnswer;
        return updatedAnswers;
      });
    };
  
    const handleClickIcon = (index) => {
      setActiveStep(index);
    }
  
    const steps = useMemo(() => {
      return resultDT[1]?.[1].map((question, index) => (index != resultDT[1][1]?.length - 1 ? {
          coverId: resultDT[4][1][index],
          label: `Câu hỏi ${index + 1}`,
          content: (
            <JobCategoryStep
              onBack={handleBack}
              onNext={handleNext}
              question={question}
              choices={resultDT[2][1][index]}
              index={index}
              answers={answers}
              updateAnswer={updateAnswer}
            />     
          )} 
          : {
              coverId: resultDT[4][1][index],
              label: `Câu hỏi ${index + 1}`,
              content: (
                <JobCategoryStep
                  onBack={handleBack}
                  onNext={handleComplete}
                  question={question}
                  choices={resultDT[2][1][index]}
                  index={index}
                  answers={answers}
                  updateAnswer={updateAnswer}
                />
              ),
            }
      ))
    }, [resultDT, answers, handleBack, handleNext, handleComplete]);

    
    useEffect(() => {
      if (!duration) return
      if (!startQuiz) return;

      let initialDuration =  duration*60;

      const interval = setInterval(() => {
        const mi = Math.floor(initialDuration / 60);
        const sec = initialDuration % 60;

        setMinutes(mi < 10 ? '0' + mi : mi);
        setSeconds(sec < 10 ? '0' + sec : sec);

        if (initialDuration === 0) {
          clearInterval(interval);
          setComplete(true)
        } else {
          initialDuration--;
        }
      }, 1000);

      return () => clearInterval(interval);

    }, [startQuiz])


    return (
      <>

        {
        complete ?
        <JobPreview 
          lessonId={lessonId}
          lmId={lmId}
          user={user}
          answers={answers}
        />
        :
        <Stack>
          {duration !== 0 && <Stack alignItems={'flex-end'} marginBottom={3} >
              <Stack direction={'row'} width={200} padding={1} spacing={2} borderRadius={2} border={'1px solid'} alignItems={'center'} justifyContent={'space-between'}>
                <Box justifyItems={'center'}  width={80}>
                  <Typography variant='h2'>{minutes}</Typography>
                </Box>
                <Box width={20}>
                  <Typography variant='h2'>:</Typography>
                </Box>
                <Box justifyItems={'center'}  width={80}>
                  <Typography variant='h2'>{seconds}</Typography>
                </Box>
              </Stack>
          </Stack>}
          {
            !startQuiz && 
            <Button variant='contained' onClick={() => setStartQuiz(true)}>
              Bắt đầu làm bài
            </Button>
          }
          { 
            startQuiz && duration !== 0 && minutes === duration && <Stack alignItems={'center'}>
              <CircularProgress size={100}/>
            </Stack>
          }
          {startQuiz && (duration === 0 || minutes !== duration) && <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              '& .MuiStepConnector-line': {
                borderLeftColor: 'divider',
                borderLeftWidth: 2,
                ml: 1
              }
            }}
          >
            {steps?.map((step, index) => {
              const isCurrentStep = activeStep === index;

              return (
                <Step key={step.label}>
                  <StepLabel StepIconComponent={StepIcon} onClick={() => handleClickIcon(index)}>
                    <Typography
                      sx={{ ml: 2 }}
                      variant="overline"
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent
                    sx={{
                      borderLeftColor: 'divider',
                      borderLeftWidth: 2,
                      ml: '20px',
                      ...(isCurrentStep && {
                        py: 4
                      })
                    }}
                  >
                    {step.coverId && <CardMedia sx={{height: 300, marginBottom: 3}} image={`${process.env.NEXT_PUBLIC_SERVER_API}/files/${step.coverId}`}/>}
                    {step.content}
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>}
        </Stack>
        }
      </>
    );
  };
  