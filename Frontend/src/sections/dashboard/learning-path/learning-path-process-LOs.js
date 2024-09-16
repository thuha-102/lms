import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { paths } from '../../../paths';
import NextLink from 'next/link';

export const LearningPathProcessLOs = (props) => {
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
            src="/assets/iconly/iconly-glass-paper-purple.svg"
            width={48}
          />
        </div>
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Typography
            color="text.secondary"
            variant="body2"
            textOverflow="ellipsis"
            noWrap
          >
            {topic}
          </Typography>
          <Typography
            color="text.primary"
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
          color="text.primary"
          fontWeight={600}
          pl={2}
        >
          {finished} %
        </Typography>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          component={NextLink}
          href={paths.dashboard.explore + `/preview_lm/${id}`}
        >
          Tiếp tục
        </Button>
      </CardActions>
    </Card>
  );
};

LearningPathProcessLOs.propTypes = {
  id: PropTypes.number.isRequired,
  topic: PropTypes.string.isRequired,
  learningObject: PropTypes.string.isRequired,
  finished: PropTypes.number.isRequired
};
