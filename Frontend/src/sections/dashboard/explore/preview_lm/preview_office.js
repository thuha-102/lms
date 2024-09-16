import {useEffect, useRef} from 'react';
// import { learning_logApi } from '../../../../api/learning-log';
// import { useAuth } from '../../../../hooks/use-auth';


export default function PreviewOfficeFile({lmId}) {

    const viewer = useRef(null);
    // const {user} = useAuth();


    // const createFileLog = async (lmId, user) => {
    //   try {
    //     const response = await learning_logApi.createLog(user.id, {
    //       rating: valueRating,
    //       time: 120, //chỗ này cần phải lấy time của lm sau đó gắn vào
    //       attempts: 1,
    //       learningMaterialId: lmId,
    //     });
    //     console.log(response);
  
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    useEffect(() => {
      import('@pdftron/webviewer').then(() => {
        WebViewer(
          {
            path: '/lib',
            licenseKey: 'demo:1716829905637:7fdb946c0300000000f14b92b2341076fc2aaff204383f40359044d0e7',
            initialDoc: `${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${lmId}`,
          },
          viewer.current,
        ).then(instance => {
            instance.UI.loadDocument(`${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials/${lmId}`);
        });
      })
    }, []);

    // useEffect(() => {
    //   try {
    //     createFileLog(parseInt(lmId,10), user)
    //   } catch (err) {
    //     console.error(err);
    //   }}, [valueRating]);

    return (
      <div className="MyComponent">
        <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
      </div>
    );
  
}