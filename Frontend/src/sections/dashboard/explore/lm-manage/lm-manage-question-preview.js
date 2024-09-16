import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Button, Card, Stack, SvgIcon, Typography } from '@mui/material';

export const JobPreview = () => (
  <Stack spacing={2}>
    <div>
      <Avatar
        sx={{
          backgroundColor: 'success.main',
          color: 'success.contrastText',
          height: 40,
          width: 40
        }}
      >
        <SvgIcon>
          <CheckIcon />
        </SvgIcon>
      </Avatar>
      <Typography
        variant="h6"
        sx={{ mt: 2 }}
      >
        Cảm ơn bài đã hoàn thành tài liệu học!
      </Typography>
      <Typography
        color="text.secondary"
        variant="body2"
      >
        Dưới đây là điểm số của bạn 
      </Typography>
    </div>
    <Card variant="outlined">
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.5
        }}
      >
        <div>
          <Typography variant="subtitle1">
            Thời gian 
          </Typography>
          <Typography
            color="text.secondary"
            variant="caption"
          >
            1/2/2024
          </Typography>
        </div>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Typography
            color="text.secondary"
            variant="caption"
          >
            Điểm số
          </Typography>
          <Button size="small">
            Xem lại
          </Button>
        </Stack>
      </Stack>
    </Card>
  </Stack>
);
