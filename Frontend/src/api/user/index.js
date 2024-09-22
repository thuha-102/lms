import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/users`;


class UserApi {
  getUser(id) {
    return axios.get(`${apiUrl}/${id}`);
  }

  getAllUser() {
    return axios.get(`${apiUrl}`);
  }

  getUserCourses(id, take) {
    const url = take ? `${apiUrl}/${id}/courses/studied?take=${take}` : `${apiUrl}/${id}/courses/studied`
    return axios.get(url);
  }

  getOwnCourses(id, keyword, visibility){
    let url = keyword ? `${apiUrl}/${id}/courses/own?keyword=${keyword}` : `${apiUrl}/${id}/courses/own`;
    url = visibility ? (keyword ? url + `&visibility=${visibility}` : url + `?visibility=${visibility}`) : url;
    return axios.get(url);
  }

  getBaseInfo(userId) {
    return axios.get(`${apiUrl}/base-information/${userId}`);
  }

  registerCourse(userId, courseId) {
    return axios.post(`${apiUrl}/${userId}/courses`, {courseId});
  }
}

export const userApi = new UserApi();
