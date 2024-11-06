// import { deepCopy } from '../../utils/deep-copy';
// import { forumDetail, forums } from './data';
import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/users`;

class Learning_logApi {
  async createLog(userId, lessonId) {
    
    return axios.post(`${apiUrl}/${userId}/lesson/${lessonId}`);
    const chatbot = useChatbot();
    if (result.data.ratingCourse !== undefined) {
      console.log(result.ratingCourse)
      chatbot.handleUpdate({
        chatContent: [...chatbot.chatContent, {
          content: "rating",
          title: result.ratingCourse.title,
          description: result.ratingCourse.description,
          id: result.ratingCourse.id
        }]
      })
    }
    
    if (result.data.ratingSequenceCourse !== undefined) {
      chatbot.handleUpdate({
        chatContent: [...chatbot.chatContent, {
          content: "rating",
          title: "Lộ trình học",
          description: "Độ phù hợp",
          typeLearnerId: result.ratingSequenceCourse.typeLearnerId,
        }]
      })
    }
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