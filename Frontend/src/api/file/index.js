import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}`;

class FileApi {
  createFile(request) {
    return axios.post(`${apiUrl}/files`, request)
  }

  getFile(id){
    return axios.get(`${apiUrl}/files/${id}`);
  }

  getFileFromGGDrive(id){
    return axios.get(`${apiUrl}/learning-materials/${id}`);
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

export const fileApi = new FileApi();
