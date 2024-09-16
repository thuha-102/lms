import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/analytics`;

class AnalyticsApi {
  getHistoryUser(field){
    return axios.get(`${apiUrl}/history-user?field=${field}`);
  }

  getHistoryLog(field){
    return axios.get(`${apiUrl}/history-log?field=${field}`);
  }

  getHistoryForum(){
    return axios.get(`${apiUrl}/history-forum`);
  }

  getHistoryRegister(userId, field){
    return axios.get(`${apiUrl}/history-register?userId=${userId}&field=${field}`);
  }

  getHistoryRegisterCourse(userId){
    return axios.get(`${apiUrl}/history-register-course?userId=${userId}`);
  }
}

export const analyticsApi = new AnalyticsApi