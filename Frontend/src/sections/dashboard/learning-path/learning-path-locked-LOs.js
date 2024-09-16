import PropTypes from 'prop-types';
import Lock01Icon from '@untitled-ui/icons-react/build/esm/Lock01';
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from '@mui/material';

import * as consts from '../../../constants';

export const LearningPathLockedLOs = (props) => {
  const { id, topic, learningObject, finished, ...other } = props;

  return (
    <Card style={{width: '450px', borderColor: 'black'}}>
      <Stack
        alignItems="center"
        direction={{
          xs: 'column',
          sm: 'row'
        }}
        spacing={3}
        sx={{
          px: 4,
          py: 3
        }}
      >
        <div>
          <img
            src="/assets/iconly/iconly-glass-paper-grey.svg"
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Typography
            color="text.disabled"
            variant="body2"
            textOverflow="ellipsis"
            noWrap
          >
            {topic}
          </Typography>
          <Typography
            color="text.disabled"
            variant="h6"
            noWrap
            textOverflow="ellipsis"
          >
            {learningObject}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Typography
          color="text.disabled"
          fontWeight={500}
          fontSize={11}
          fontStyle="italic"
          pl={2}
        >
          Trải nghiệm bài học trước để mở
        </Typography>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <Lock01Icon />
            </SvgIcon>
          )}
          size="small"
          disabled
        >
          Chưa mở
        </Button>
      </CardActions>
    </Card>
  );
};

LearningPathLockedLOs.propTypes = {
  id: PropTypes.number.isRequired,
  topic: PropTypes.string.isRequired,
  learningObject: PropTypes.string.isRequired,
  finished: PropTypes.number.isRequired
};
