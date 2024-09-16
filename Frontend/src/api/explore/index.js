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

  createLesson(request) {
    return axios.post(`${apiUrl}/lessons`, request)
  }

  detailCourse(id) {
    return axios.get(`${apiUrl}/courses/${id}`);
  }

  getLesson(id) {
    return axios.get(`${apiUrl}/lessons/${id}`);
  }

  getListCourse(){
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
