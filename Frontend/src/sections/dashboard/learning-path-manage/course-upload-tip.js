import { Box, Typography, List, ListItem } from '@mui/material';

const CourseUploadTips = () => {
  return (
    <Box border={1} p={2} borderRadius={2} boxShadow={25}>
      <Typography variant="h6" gutterBottom>
        Một số lưu ý trước khi tạo khoá học mới
      </Typography>
      <List>
        <ListItem>Đặt tuỳ chọn giá khoá học hoặc miễn phí.</ListItem>
        <ListItem>Ảnh quảng bá tiêu chuẩn của khoá học có kích thước 700x430.</ListItem>
        <ListItem>Video section controls the course overview video.</ListItem>
        <ListItem>Course Builder is where you create & organize a course.</ListItem>
        <ListItem>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</ListItem>
        <ListItem>Prerequisites refer to the fundamental courses to complete before taking this particular course.</ListItem>
        <ListItem>Information from the Additional Data section shows up on the course single page.</ListItem>
      </List>
    </Box>
  );
};

export default CourseUploadTips;
