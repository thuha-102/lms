// // import Video from 'next-video';
// import getStarted from '/videos/get-started.mp4';
import { useEffect, useState, useRef } from 'react';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';

const Page = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const updateCurrentTime = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      video.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  const handleVideoSeek = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime);
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="70%"
        // height="70%"
        controls
        preload="none"
        onTimeUpdate={handleVideoSeek}
      >
        <source src={`${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/531`} type="video/mp4" />
        <track
          src="/path/to/captions.vtt"
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
      <p>Current Time: {currentTime.toFixed(2)} seconds</p>
    </div>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;



// import React from 'react'
// import ReactPlayer from 'react-player'
// // import '~video-react/dist/video-react.css';

// const Page = () => {
//   return (    
//     // Render a YouTube video player
//     <ReactPlayer url=`${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/531` />
//   );
// };

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

// export default Page;

