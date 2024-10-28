import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/users`;


class UserApi {
  getUser(id) {
    return axios.get(`${apiUrl}/${id}`);
  }

  updateUser(id, request){
    return axios.patch(`${apiUrl}/${id}`, request)
  }

  getAllUser(username) {
    return axios.get(username ? `${apiUrl}?username=${username}` : apiUrl);
  }

  getUserCourses(id, keyword) {
    const url = keyword ? `${apiUrl}/${id}/courses/studied?keyword=${keyword}` : `${apiUrl}/${id}/courses/studied`
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
    return axios.post(`${apiUrl}/${userId}/register/${courseId}`);
  }

  getCart(userId){
    return axios.get(`${apiUrl}/${userId}/cart`);
  }

  addCart(userId, courseId){
    return axios.post(`${apiUrl}/${userId}/cart`, {courseId: parseInt(courseId, 10)});
  }

  deleteCart(userId, courseIds){
    return axios.post(`${apiUrl}/${userId}/cart/delete-batch`, {courseIds: courseIds});
  }

  updateLastedCourseInSequence(userId, request){
    return axios.patch(`${apiUrl}/${userId}/latest-course-in-sequence`, request);
  }

  deleteUser(userId){
    return axios.delete(`${apiUrl}/${userId}`)
  }
}

export const userApi = new UserApi();
