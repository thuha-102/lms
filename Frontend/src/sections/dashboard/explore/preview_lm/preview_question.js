import { useCallback, useMemo, useState, useEffect } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Step, StepContent, StepLabel, Stepper, SvgIcon, Typography } from '@mui/material';
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
    const { lmId, user } = props;
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
            setResultDT(temp)
          }
        } catch (err) {
          console.error(err);
        }
      };
    
      fetchData(lmId);
    }, []);
    console.log(resultDT)
  
    const [answers, setAnswers] = useState([])

    useEffect(() => {
      setAnswers(new Array(resultDT[1]?.length))
    }, []);
  
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
      console.log(resultDT)
      return resultDT[3]?.[1].map((question, index) => (index != resultDT[3][1]?.length - 1 ? {
          label: `Câu hỏi ${index + 1}`,
          content: (
            <JobCategoryStep
              onBack={handleBack}
              onNext={handleNext}
              question={question}
              choices={resultDT[4][1][index]}
              index={index}
              answers={answers}
              updateAnswer={updateAnswer}
            />     
          )} 
          : {
              label: `Câu hỏi ${index + 1}`,
              content: (
                <JobCategoryStep
                  onBack={handleBack}
                  onNext={handleComplete}
                  question={question}
                  choices={resultDT[4][1][index]}
                  index={index}
                  answers={answers}
                  updateAnswer={updateAnswer}
                />
              ),
            }
      ))
    }, [resultDT, answers, handleBack, handleNext, handleComplete]);
  
    if (complete) {
      return <JobPreview 
                lmId={lmId}
                user={user}
                answers={answers}
              />;
    }
  
    return (
      <Stepper
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
          console.log(answers)
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
                {step.content}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    );
  };
  