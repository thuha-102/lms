import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}`;

class topic_manage_Api {
  getListTopic() {
    return axios.get(`${apiUrl}/topics`);
    //return Promise.resolve(deepCopy(forums));
  }

  createTopic(request) {
    return axios.post(`${apiUrl}/topics`, request)
  }

  updateTopic(id, request) {
    return axios.patch(`${apiUrl}/topics/${id}`, request)
  }

  deleteTopic(id) {
    return axios.delete(`${apiUrl}/topics/${id}`)
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

export const topic_manageApi = new topic_manage_Api();
