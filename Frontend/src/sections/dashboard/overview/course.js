import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import { Box, Button, Card, CardActions, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import NextLink from 'next/link';
import { paths } from '../../../paths';


export const Course = (props) => {
  const { title, amount, id } = props;

  return (
    <Card>
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {title}
          </Typography>
          <Typography
            color="text.primary"
            variant="h4"
          >
            {amount} phút
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          component={NextLink}
          href={`${paths.dashboard.explore}/${id}`}
        >
          Đi đến khoá học
        </Button>
      </CardActions>
    </Card>
  );
};

Course.propTypes = {
  amount: PropTypes.number.isRequired
};
