import { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const CourseBuilder = () => {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Difficult Things About Education.' },
    { id: 2, title: 'Five Things You Should Do In Education.' },
  ]);

  const addLesson = () => {
    setLessons([...lessons, { id: lessons.length + 1, title: 'New Lesson' }]);
  };

  return (
    <Box my={4}>
      <Typography variant="h5" gutterBottom>
        Course Builder
      </Typography>
      {lessons.map((lesson) => (
        <Card key={lesson.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography>{lesson.title}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" color="primary" onClick={addLesson}>
        Add Lesson
      </Button>
    </Box>
  );
};

export default CourseBuilder;
