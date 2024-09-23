import {useEffect, useRef, useState} from 'react';
import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import { BookmarkIcon, defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PreviewOfficeFile({lmId}) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin(
      {
        sidebarTabs: (defaultTabs) => [
          defaultTabs[0],
        ],
      }
    );

    return (
      <div 
        className='MyComponent'
        style={{
          height: '1000px'
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer 
            fileUrl={`${process.env.NEXT_PUBLIC_SERVER_API}/files/${lmId}`} 
            plugins={[defaultLayoutPluginInstance]}
          />;
        </Worker>
      </div>
    );
  
}