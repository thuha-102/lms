import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/analytics`;

class AnalyticsApi {
  getAnnuallyCreateUser(field){
    return axios.get(`${apiUrl}/annually-create-user?field=${field}`);
  }

  getAnnuallyPurchaseCourse(field){
    return axios.get(`${apiUrl}/annually-purchase-course?field=${field}`);
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

  getGroupRate(){
    return axios.get(`${apiUrl}/group-rate`);
  }

  getGroupProgressAndScore(){
    return axios.get(`${apiUrl}/group-progress-and-score`);
  }
}

export const analyticsApi = new AnalyticsApi;

export const desktopOS = [
  {
    label: 'Nhóm 1',
    value: 72.72,
  },
  {
    label: 'Nhóm 2',
    value: 16.38,
  },
  {
    label: 'Nhóm 3',
    value: 3.83,
  },
  {
    label: 'Nhóm 4',
    value: 2.42,
  },
  {
    label: 'Nhóm 5',
    value: 4.65,
  },
];

export const valueFormatter = (item) => `${item.value}%`;

export const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    typeLearner: 'Nhóm 1',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    typeLearner: 'Nhóm 2',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    typeLearner: 'Nhóm 3',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    typeLearner: 'Nhóm 4',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    typeLearner: 'Nhóm 5',
  },
];

export const valueFormatterBarChart = (value) => `${value} phần trăm`;