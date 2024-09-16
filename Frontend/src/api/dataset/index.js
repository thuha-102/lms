import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/dataset`;

class DatasetApi {
  getDatasets(queryParams) {
    return axios.get(apiUrl, { params: queryParams });
  }

  getDatasetDetail(id) {
    return axios.get(`${apiUrl}/${id}`);
    //return Promise.resolve(deepCopy(forumDetail));
  }

  postDataset(request) {
    return axios.post(apiUrl, request)
  }

  putDataset(id, request) {
    return axios.put(`${apiUrl}/${id}`, request);
  }
}

export const datasetApi = new DatasetApi();
