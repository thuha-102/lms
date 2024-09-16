import PropTypes from 'prop-types';

const icons = {
  jpeg: '/assets/icons/icon-jpg.svg',
  jpg: '/assets/icons/icon-jpg.svg',
  mp4: '/assets/icons/icon-mp4.svg',
  pdf: '/assets/icons/icon-pdf.svg',
  png: '/assets/icons/icon-png.svg',
  svg: '/assets/icons/icon-svg.svg',
  WORD: '/assets/icons/icon-word.svg',
  QUIZ: '/assets/icons/icon-quiz.svg',
  CODE: '/assets/icons/icon-code.svg',
  PPT: '/assets/icons/icon-ppt.svg',
  VIDEO: '/assets/icons/icon-video.svg',
  PDF: '/assets/icons/icon-another-pdf.svg',
};

export const FileIcon = (props) => {
  const { extension } = props;

  let icon;

  if (!extension) {
    icon = '/assets/icons/icon-other.svg';
  } else {
    icon = icons[extension] || '/assets/icons/icon-other.svg';
  }

  return <img src={icon} />;
};

FileIcon.propTypes = {
  extension: PropTypes.string
};
