// import { deepCopy } from '../../utils/deep-copy';
// import { forumDetail, forums } from './data';
import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/users`;

class Learning_logApi {
  createLog(userId, lessonId, request) {
    return axios.post(`${apiUrl}/${userId}/lesson/${lessonId}`, request);
    //return Promise.resolve(deepCopy(forums));
  }

  createQuizLog(userId, request){
    return axios.post(`${apiUrl}/${userId}/quiz`, request);
  }

  getLog(userId) {
    return axios.get(`${apiUrl}/${userId}`);
    //return Promise.resolve(deepCopy(forums));
  }

  updateRating(logId, request) {
    return axios.patch(`${apiUrl}/${logId}`, request);
  }

}

export const learning_logApi = new Learning_logApi();