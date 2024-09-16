import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/notebook`;

class NotebookApi {
  getNotebooks(queryParams) {
    return axios.get(apiUrl, { params: queryParams });
  }

  getNotebookDetail(id) {
    return axios.get(`${apiUrl}/${id}`);
  }

  postNotebook(request) {
    return axios.post(apiUrl, request)
  }

  putNotebook(id, request) {
    return axios.put(`${apiUrl}/${id}`, request);
  }
}

export const notebookApi = new NotebookApi();
