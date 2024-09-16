// import WebViewer from '@pdftron/webviewer';
import {useEffect, useRef} from 'react';

export default function PreviewFile({lmId}) {

    const viewer = useRef(null);

    useEffect(() => {
      import('@pdftron/webviewer').then(() => {
        WebViewer(
          {
            path: '/lib',
            licenseKey: 'demo:1716829905637:7fdb946c0300000000f14b92b2341076fc2aaff204383f40359044d0e7',
            initialDoc: `${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${lmId}`,
          },
          viewer.current,
        ).then((instance) => {
          });
      })
    }, []);


    return (
      <div className="MyComponent">
        <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
      </div>
    );
  
}