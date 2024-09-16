import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/model`;

class ModelApi {
  getModels(queryParams) {
    return axios.get(apiUrl, { params: queryParams });
  }

  getModelDetail(id) {
    return axios.get(`${apiUrl}/${id}`);
  }

  postModel(request) {
    return axios.post(apiUrl, request)
  }

  postModelVariation(request) {
    return axios.post(`${process.env.NEXT_PUBLIC_SERVER_API}/modelVariation`, request)
  }

  putModel(id, request) {
    return axios.put(`${apiUrl}/${id}`, request);
  }
}

export const modelApi = new ModelApi();
