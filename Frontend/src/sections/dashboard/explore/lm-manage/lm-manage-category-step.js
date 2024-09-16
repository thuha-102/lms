import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import { Button, Card, Radio, Stack, SvgIcon, Typography } from '@mui/material';

const question = [
    "What is Data mining?"
]
const choices = [
    "Just a subject",
    "A Science",
    "Get value information from data"
];

export const JobCategoryStep = (props) => {
  const { onBack, onNext, question, choices, index, answers, updateAnswer , ...other } = props;
  const [category, setCategory] = useState(answers[index]);


  const handleCategoryChange = useCallback((category) => {
    setCategory(category);
    updateAnswer(index,category);
  }, []);

  return (
    <Stack
      spacing={3}
      {...other}>
      <div>
        <Typography variant="h6">
            {question}
        </Typography>
      </div>
      <Stack spacing={2}>
        {choices.map((option, indexValue) => (
          <Card
            key={indexValue}
            sx={{
              alignItems: 'center',
              cursor: 'pointer',
              display: 'flex',
              p: 2,
              ...(category === indexValue && {
                backgroundColor: 'primary.alpha12',
                boxShadow: (theme) => `${theme.palette.primary.main} 0 0 0 1px`
              })
            }}
            onClick={() => handleCategoryChange(indexValue)}
            variant="outlined"
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            //   spacing={1}
            >
              <Radio
                checked={category === indexValue}
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
      >
        <Button
          color="inherit"
          onClick={onBack}
          startIcon={(
            <SvgIcon>
              <ArrowLeftIcon />
            </SvgIcon>
          )}
        >
          Về trước
        </Button>
        <Button
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          onClick={onNext}
          variant="contained"
        >
          Tiếp tục
        </Button>
      </Stack>
    </Stack>
  );
};

JobCategoryStep.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};
