import PropTypes from 'prop-types';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import ArrowNarrowDownLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowDownLeft';
import ArrowNarrowDownRightIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowDownRight';
import ArrowNarrowDownIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowDown';
import ArrowNarrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowNarrowRight';
import { useSettings } from '../../../hooks/use-settings';
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  Button,
  Grid,
  Container, 
  Tooltip
} from '@mui/material';

import * as consts from '../../../constants';

export const ChooseGoalLearningPathDialog = (props) => {
  const { onClose, onContinue, open = false, selectedGoals, setSelectedGoals, ...other } = props;
  const settings = useSettings();
  console.log(selectedGoals)
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
          Chọn mục tiêu của bạn
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
        <Typography variant="subtitle1">Click chọn mục tiêu của bạn:</Typography>
        <Typography variant="body1" fontStyle="italic" fontSize={13} mb={2}>*Di chuột vào để xem thông tin chi tiết</Typography>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            mb={2}
          >
            <Grid item xs={12} mb={1}>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <Tooltip title={consts.LEARNER_GOAL_FUNDAMENTALS.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_FUNDAMENTALS.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_FUNDAMENTALS.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_FUNDAMENTALS.value, ...consts.LEARNER_GOAL_FUNDAMENTALS.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_FUNDAMENTALS.label}
                  </Button> 
                </Tooltip>
              </div>
            </Grid>  
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <SvgIcon>
                  <ArrowNarrowDownLeftIcon />
                </SvgIcon>
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>  
            <Grid item xs={4}>
              <div style={{ display: "flex", justifyContent: "flex-start"}}>
                <SvgIcon>
                  <ArrowNarrowDownRightIcon />
                </SvgIcon>
              </div>
            </Grid>      
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Tooltip title={consts.LEARNER_GOAL_DATA_SCIENTIST.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_DATA_SCIENTIST.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_DATA_SCIENTIST.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_DATA_SCIENTIST.value, ...consts.LEARNER_GOAL_DATA_SCIENTIST.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_DATA_SCIENTIST.label}
                  </Button> 
                </Tooltip>
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Tooltip title={consts.LEARNER_GOAL_DATA_ENGINEER.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_DATA_ENGINEER.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_DATA_ENGINEER.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_DATA_ENGINEER.value, ...consts.LEARNER_GOAL_DATA_ENGINEER.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_DATA_ENGINEER.label}
                  </Button> 
                </Tooltip> 
              </div>
            </Grid>
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <SvgIcon>
                  <ArrowNarrowDownIcon />
                </SvgIcon>
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>  
            <Grid item xs={4}>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <SvgIcon>
                  <ArrowNarrowDownIcon />
                </SvgIcon>
              </div>
            </Grid>   
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Tooltip title={consts.LEARNER_GOAL_MACHINE_LEARNING.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_MACHINE_LEARNING.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_MACHINE_LEARNING.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_MACHINE_LEARNING.value, ...consts.LEARNER_GOAL_MACHINE_LEARNING.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_MACHINE_LEARNING.label}
                  </Button> 
                </Tooltip> 
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Tooltip title={consts.LEARNER_GOAL_BIG_DATA_ENGINEER.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_BIG_DATA_ENGINEER.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_BIG_DATA_ENGINEER.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_BIG_DATA_ENGINEER.value, ...consts.LEARNER_GOAL_BIG_DATA_ENGINEER.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_BIG_DATA_ENGINEER.label}
                  </Button> 
                </Tooltip> 
              </div>
            </Grid>
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <SvgIcon>
                  <ArrowNarrowDownIcon />
                </SvgIcon>
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>  
            <Grid item xs={4}></Grid>  
            <Grid item xs={4} mb={1}>
              <div style={{ display: "flex", justifyContent: "flex-end"}}>
                <Tooltip title={consts.LEARNER_GOAL_DEEP_LEARNING.helpInfo} placement="right">
                  <Button
                    variant="outlined"
                    sx = {{
                      borderColor: selectedGoals.includes(consts.LEARNER_GOAL_DEEP_LEARNING.value) ? "Highlight" : "lightgrey",
                      borderWidth: selectedGoals.includes(consts.LEARNER_GOAL_DEEP_LEARNING.value) ? 3 : 2,
                      
                      color: "text.primary",
                    }}
                    onClick={() => {
                      setSelectedGoals([consts.LEARNER_GOAL_DEEP_LEARNING.value, ...consts.LEARNER_GOAL_DEEP_LEARNING.pre.map(g => g.value)]);
                    }}
                  >
                    {consts.LEARNER_GOAL_DEEP_LEARNING.label}
                  </Button> 
                </Tooltip> 
              </div>
            </Grid>  
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Container>
        <Stack flexDirection="row" justifyContent="flex-end">
          <Button
            variant="inherit"
            endIcon={(
              <SvgIcon>
                <ArrowNarrowRightIcon />
              </SvgIcon>
            )}
            disabled={selectedGoals.length == 0}
            onClick={onContinue}
          >
            Tiếp theo
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
};

ChooseGoalLearningPathDialog.propTypes = {
  onClose: PropTypes.func,
  onContinue: PropTypes.func,
  open: PropTypes.bool,
  setSelectedGoals: PropTypes.func,
  selectedGoals: PropTypes.array
};
