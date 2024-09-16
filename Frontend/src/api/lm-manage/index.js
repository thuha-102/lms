// import { deepCopy } from '../../utils/deep-copy';
// import { forumDetail, forums } from './data';
import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/learning-materials`;

class lm_manage_Api {
  createLM(request) {
    return axios.post(apiUrl, request);
    //return Promise.resolve(deepCopy(forums));
  }

  getLM(search){
    const res = axios.get(apiUrl);
    let data = Promise.resolve(res);
    console.log(data)

    if (typeof search.filters !== 'undefined') {
      data = data.filter((lm) => {
        if (typeof search.filters.name !== 'undefined' && search.filters.name !== '') {
          const nameMatched = lm.name.toLowerCase().includes(filters.name.toLowerCase());

          if (!nameMatched) {
            return false;
          }
        }

        // It is possible to select multiple category options
        if (typeof search.filters.category !== 'undefined' && search.filters.category.length > 0) {
          const categoryMatched = search.filters.category.includes(lm.category);

          if (!categoryMatched) {
            return false;
          }
        }

        // It is possible to select multiple status options
        if (typeof search.filters.status !== 'undefined' && search.filters.status.length > 0) {
          const statusMatched = search.filters.status.includes(lm.status);

          if (!statusMatched) {
            return false;
          }
        }

        // Present only if filter required
        if (typeof search.filters.inStock !== 'undefined') {
          const stockMatched = lm.inStock === search.filters.inStock;

          if (!stockMatched) {
            return false;
          }
        }

        return true;
      });
    }

    if (typeof search.page !== 'undefined' && typeof search.rowsPerPage !== 'undefined') {
      data = applyPagination(data, page, rowsPerPage);
    }
    console.log(data);
    console.log(search);

    return data;
  }

  getLMs() {
    return axios.get(apiUrl);
    //return Promise.resolve(deepCopy(forums));
  }

  get1Lm(id) {
    return axios.get(`${apiUrl}/${id}`)
  }

  getDetailLM (id) {
    return axios.get(`${apiUrl}/${id}/information`)
  }

  deleteLM (id) {
    return axios.delete(`${apiUrl}/${id}`)
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
}

export const lm_manageApi = new lm_manage_Api();