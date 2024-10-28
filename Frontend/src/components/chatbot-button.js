import PropTypes from 'prop-types';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { Box, ButtonBase, SvgIcon, Tooltip } from '@mui/material';

export const ChatbotButton = (props) => (
  <Tooltip title="Chatbot">
    <Box {...props}
         sx={{
           backgroundColor: 'background.paper',
           borderRadius: '50%',
           bottom: 60,
           boxShadow: 16,
           margin: (theme) => theme.spacing(4),
           position: 'fixed',
           right: 0,
           zIndex: (theme) => theme.zIndex.speedDial
         }}
    >
      <ButtonBase
        sx={{
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          color: 'primary.contrastText',
          p: '10px'
        }}
      >
        <SvgIcon>
          <ContactSupportOutlinedIcon />
        </SvgIcon>
      </ButtonBase>
    </Box>
  </Tooltip>
);

ChatbotButton.propTypes = {
  onClick: PropTypes.func
};
