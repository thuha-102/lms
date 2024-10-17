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

  createLesson(request) {
    return axios.post(`${apiUrl}/topics`, request)
  }

  detailCourse(id, userId) {
    if (userId) return axios.get(`${apiUrl}/courses/${id}?userId=${userId}`);
    return axios.get(`${apiUrl}/courses/${id}`);
  }

  getTopic(id) {
    return axios.get(`${apiUrl}/topics/${id}`);
  }

  getListCourse(keyword){
    if (keyword) return axios.get(`${apiUrl}/courses?keyword=${keyword}`)
    return axios.get(`${apiUrl}/courses`);
  }

  deleteLesson(id) {
    return axios.delete(`${apiUrl}/lessons/${id}`);
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
