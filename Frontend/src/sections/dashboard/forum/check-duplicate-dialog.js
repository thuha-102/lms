import { useCallback, useState, useEffect } from 'react';
import PropTypes, { any } from 'prop-types';
import { useRouter } from 'next/router';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  Link,
  Button
} from '@mui/material';
import { useMounted } from '../../../hooks/use-mounted';
import { forumApi } from '../../../api/forum';
import { paths } from '../../../paths';

const useSimilarForums = (forumDetail) => {
  const isMounted = useMounted();
  const [similarForums, setSimilarForums] = useState(null);

  const getSimilarForums = useCallback(async () => {
    try {
      const response = await forumApi.getSimilarForumS(forumDetail);
      console.log(response);
      if (isMounted()) {
        setSimilarForums(response.data);   
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getSimilarForums();
  },[]);

  return similarForums;
};

export const CheckDuplicateDialog = (props) => {
  const { onClose, open = false, forumDetail, ...other } = props;
  const similarForums = useSimilarForums(forumDetail)
  const router = useRouter();

  const handleSubmitButton = useCallback(async () => {
    const forumDetailFormData = new FormData();
    for (const key in forumDetail) {
      if (forumDetail.hasOwnProperty(key)) {
        const value = forumDetail[key];
        if (Array.isArray(value)) {
          value.forEach(element => {
            forumDetailFormData.append(`${key}[]`, element);
          });
        } else {
          forumDetailFormData.append(key, value);
        }
      }
    }
    await forumApi.postForum(forumDetailFormData)
      .then((response) => {
        router.push(paths.dashboard.forum.details.replace(':forumId', response.data.id));
      })
      .catch(error => {
        console.error('Error posting data:', error);
      })
  }, []);

  if (similarForums == null) {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={onClose}
        open={open}
        {...other}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3
          }}
        >
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  if (similarForums.length == 0) {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={onClose}
        open={open}
        {...other}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{
            px: 3,
            py: 2
          }}
        >
          <Typography variant="h6">
            Kiểm tra
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <SvgIcon>
              <XIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
        <DialogContent>
          <Typography variant="subtitle1" sx={{fontWeight: 600, mb: 2}}>
            Nội dung diễn đàn của bạn không bị trùng lặp với các nội dung đã có. Xác nhận đăng bài!
          </Typography>
          <Stack flexDirection="row" justifyContent="flex-end">
            <Button
              onClick={handleSubmitButton}
              variant="contained"
            >
              Xác nhận
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      {...other}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Typography variant="h6">
          Kiểm tra
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
          Phát hiện các diễn đàn có nội dung tương tự, xin hãy duyệt qua chúng để đảm bảo nội dung bài đăng của bạn không bị trùng lặp
        </Typography>
        <Typography variant="subtitle2" sx={{fontWeight: 300, fontSize: 12, fontStyle: "italic"}}>
          Nhấn vào các đường link diễn đàn dưới đây để bạn có thể duyệt qua chúng trong tab trình duyệt mới. Tiến trình của bạn sẽ được lưu trữ tại đây để bạn có thể quay lại và tiếp tục!
        </Typography>
        <Box
          sx={{ my: 2, borderRadius: '10px', border: '1px solid', borderColor: "action.disabledBackground", py: 1, px: 2 }}
        >
          {similarForums.map(forum => 
            <Stack flexDirection="row" key={forum.id} >
              <Typography variant='subtitle2' color="text.primary">•{'\u00A0'}</Typography>
              <Link 
                href={paths.dashboard.forum.details.replace(':forumId', forum.id)} 
                underline="hover"
                fontSize={15}
                fontWeight={500}
                color="text.primary"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {forum.title}
              </Link>
              <Typography color="text.secondary" marginLeft="auto" fontSize={12} fontStyle="italic">Độ tương tự: {(forum.similarScore*100).toFixed()} %</Typography>
            </Stack>)}
        </Box>
        <Stack flexDirection="row" justifyContent="flex-end">
          <Button
            onClick={handleSubmitButton}
            variant="contained"
          >
            Xác nhận
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

CheckDuplicateDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  forumDetail: any
};
