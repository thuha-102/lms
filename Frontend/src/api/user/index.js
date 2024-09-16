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
    const url = take ? `${apiUrl}/${id}/courses?take=${take}` : `${apiUrl}/${id}/courses`
    return axios.get(url);
  }

  getOwnCourses(id){
    console.log(id)
    return axios.get(`${process.env.NEXT_PUBLIC_SERVER_API}/courses/${id}/own`);
  }

  getBaseInfo(userId) {
    return axios.get(`${apiUrl}/base-information/${userId}`);
  }

  registerCourse(userId, courseId) {
    return axios.post(`${apiUrl}/${userId}/courses`, {courseId});
  }
}

export const userApi = new UserApi();
