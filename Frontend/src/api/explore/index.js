import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}`;

class ExploreApi {
  getListTopic() {
    return axios.get(`${apiUrl}/topics`);
    //return Promise.resolve(deepCopy(forums));
  }

  createCourse(request) {
    return axios.post(`${apiUrl}/courses`, request)
  }

  updateCourse(courseId, request) {
    return axios.patch(`${apiUrl}/courses/${courseId}`, request);
  }

  createTopic(request) {
    return axios.post(`${apiUrl}/topics`, request)
  }

  updateLesson(lessonId, request){
    return axios.patch(`${apiUrl}/lessons/${lessonId}`, request)
  }

  detailCourse(id, userId) {
    if (userId) return axios.get(`${apiUrl}/courses/${id}?userId=${userId}`);
    return axios.get(`${apiUrl}/courses/${id}`);
  }

  getTopic(id) {
    return axios.get(`${apiUrl}/topics/${id}`);
  }

  updateTopic(topicId, request) {
    return axios.patch(`${apiUrl}/topics/${topicId}`, request);
  }

  getListCourse(keyword){
    if (keyword) return axios.get(`${apiUrl}/courses?keyword=${keyword}`)
    return axios.get(`${apiUrl}/courses`);
  }

  deleteTopic(id) {
    return axios.delete(`${apiUrl}/topics/${id}`);
  }

  deleteLesson(id) {
    return axios.delete(`${apiUrl}/lessons/${id}`);
  }

  deleteCourse(id){
    return axios.delete(`${apiUrl}/courses/${id}`);
  }

  getLM(id){
    return axios.get(`${apiUrl}/files/${id}`);
  }

  getLesson(id){
    return axios.get(`${apiUrl}/lessons/${id}`);
  }

  deleteLearningMaterial(id){
    return axios.delete(`${apiUrl}/files/${id}`)
  }
//   getForumDetail(id) {
//     return axios.get(`${apiUrl}/${id}`);
//     //return Promise.resolve(deepCopy(forumDetail));
//   }

//   getSimilarForumS(request) {
//     return axios.post(`${apiUrl}/similarForums`, request)
//   }

//   postForum(request) {
//     return axios.post(apiUrl, request)
//   }

//   getComments(id) {
//     return axios.get(`${apiUrl}/${id}/comment`);
//   }

//   postComment(request) {
//     return axios.post(`${apiUrl}/comment`, request)
//   }
}

export const exploreApi = new ExploreApi();
