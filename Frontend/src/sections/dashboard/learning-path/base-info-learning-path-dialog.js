import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import ArrowNarrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowRight';
import ArrowNarrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowLeft';
import { useSettings } from '../../../hooks/use-settings';
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  Button,
  Container,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel
} from '@mui/material';
import { useMounted } from '../../../hooks/use-mounted';
import { userApi } from '../../../api/user';
import * as consts from '../../../constants';
import { useAuth } from '../../../hooks/use-auth';

const useBaseInfo = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [baseInfo, setBaseInfo] = useState(null);

  const getBaseInfo = useCallback(async () => {
    try {
      const response = await userApi.getBaseInfo(user.id);

      if (isMounted()) {
        setBaseInfo(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getBaseInfo();
  },[]);

  return baseInfo;
};

export const BaseInfoLearningPathDialog = (props) => {
  const { onClose, open = false, baseInfoAnswer, setBaseInfoAnswer, onContinue, onBack, ...other } = props;
  const settings = useSettings();
  const baseInfo = useBaseInfo();

  useEffect(() => {
    if (baseInfo && !baseInfo.backgroundKnowledge) {
      setBaseInfoAnswer(Array.from({ length: consts.BASE_INFO_QUES.length }, () => null));
    }
  }, [baseInfo])

  if (!baseInfo) return null;

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
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
          Thông tin căn bản
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
      {baseInfoAnswer.length == 0 && 
      <DialogContent>
        <Typography variant="subtitle1" >Hệ thống đã ghi nhận kết quả lần khảo sát các thông tin căn bản của bạn lần trước như sau:</Typography>
          <Container maxWidth={settings.stretch ? false : 'xl'}>
            <div style={{ marginTop: 10, marginBottom: 10}}>
              <Typography color="text.primary" fontSize={15} fontWeight={700} >Trình độ học vấn</Typography>
              <div style={{ marginLeft: 10}}>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {baseInfo.qualification == consts.QUALIFICATION_HIGHSCHOOL ? "Phổ thông" : baseInfo.qualification == consts.QUALIFICATION_GRADUATE ? "Đã tốt nghiệp đại học" : "Đang học đại học"}</Typography>
              </div>
            </div>
            <div style={{ marginBottom: 10}}>
              <Typography color="text.primary" fontSize={15} fontWeight={700} >Kiến thức hiện tại  </Typography>
              <div style={{ marginLeft: 10}}>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {baseInfo.backgroundKnowledge == consts.BACKGROUND_KNOWLEDGE_BASIC ? "Mới bắt đầu" : baseInfo.backgroundKnowledge == consts.BACKGROUND_KNOWLEDGE_INTERMEDIATE ? "Trình độ trung cấp" : "Chuyên gia"}</Typography>
              </div>
            </div>
            <div style={{ marginBottom: 10}}>
              <Typography color="text.primary" fontSize={15} fontWeight={700}>Phong cách học (theo mô hình Felder-Silverman)</Typography>
              <div style={{ marginLeft: 10}}>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {consts.ACT_REF.get(baseInfo.learningStyle[0])}</Typography>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {consts.SEN_INT.get(baseInfo.learningStyle[1])}</Typography>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {consts.VIS_VRB.get(baseInfo.learningStyle[2])}</Typography>
                <Typography color="text.primary" fontSize={15} fontWeight={500} mt={1}>• {consts.SEQ_GLO.get(baseInfo.learningStyle[3])}</Typography>
              </div>
              
            </div>
          </Container>
        <Typography color="text.caution" fontWeight={500} mb={4}> Bạn có thể lấy kết quả này để tạo lộ trình học lần này hoặc làm lại khảo sát để tiến hành cập nhật thông tin</Typography>
        <Stack flexDirection="row" justifyContent="space-between">
          <Button
            variant="inherit"
            startIcon={(
              <SvgIcon>
                <ArrowNarrowLeftIcon />
              </SvgIcon>
            )}
            onClick={onBack}
          >
            Về trước
          </Button>
          <Button
            variant="inherit"
            onClick={() => setBaseInfoAnswer(Array.from({ length: consts.BASE_INFO_QUES.length }, () => null))}
          >
            Làm lại khảo sát
          </Button>
          <Button
            variant="inherit"
            endIcon={(
              <SvgIcon>
                <ArrowNarrowRightIcon />
              </SvgIcon>
            )}
            disabled={!baseInfo || baseInfoAnswer.includes(null)}
            onClick={onContinue}
          >
            Tiếp theo
          </Button>
        </Stack>
      </DialogContent>}
      {baseInfoAnswer.length != 0 && 
      <DialogContent>
        <Typography variant="subtitle1" mb={2}>Vui lòng thực hiện khảo sát sau để chúng tôi có thể tạo ra lộ trình học phù hợp nhất với bạn:</Typography>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          {consts.BASE_INFO_QUES.map((q, i) => 
            <FormControl key={i} sx={{ mb: 2, width: "100%" }}>
              <FormLabel id="demo-radio-buttons-group-label" ><Typography color="text.primary" fontSize={14} fontWeight={500}>{i + 1}{") "}{q.question}</Typography></FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={baseInfoAnswer[i]}
                onChange={(_, value) => {
                  console.log(value);
                  setBaseInfoAnswer([...baseInfoAnswer.slice(0, i), value, ...baseInfoAnswer.slice(i+1)])
                }}
              >
                {q.options.map(o => <FormControlLabel key={o.value} value={o.value} control={<Radio size="small" />} label={<Typography variant="body1" fontSize={13}>{o.label}</Typography>}/>)}
              </RadioGroup>
            </FormControl>
          )}
          {baseInfoAnswer.includes(null) && <Typography fontSize={15} color="text.caution" fontStyle="italic" fontWeight={500} mb={2}>*Vui lòng trả lời tất cả câu hỏi!</Typography>}
        </Container>
        <Stack flexDirection="row" justifyContent="space-between">
          <Button
            variant="inherit"
            startIcon={(
              <SvgIcon>
                <ArrowNarrowLeftIcon />
              </SvgIcon>
            )}
            onClick={onBack}
          >
            Về trước
          </Button>
          <Button
            variant="inherit"
            endIcon={(
              <SvgIcon>
                <ArrowNarrowRightIcon />
              </SvgIcon>
            )}
            disabled={!baseInfo || baseInfoAnswer.includes(null)}
            onClick={onContinue}
          >
            Tiếp theo
          </Button>
        </Stack>
      </DialogContent>}
    </Dialog>
  )
};

BaseInfoLearningPathDialog.propTypes = {
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  setBaseInfoAnswer: PropTypes.func,
  baseInfoAnswer: PropTypes.array
};