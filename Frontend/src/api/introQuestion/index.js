import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/introQuestion`;

class IntroQuestionApi {
  getIntroQuestions(queryParams) {
    return axios.get(apiUrl, { params: queryParams });
  }

  postIntroQuestion(request) {
    return axios.post(apiUrl, request)
  }

  putIntroQuestion(id, request) {
    return axios.put(`${apiUrl}/${id}`, request);
  }

  deleteIntroQuestion(id) {
    return axios.delete(`${apiUrl}/${id}`);
  }

  submitIntroQuestionsAnswers(request) {
    return {"typeLearnerId": 0}
  }
}

export const introQuestionApi = new IntroQuestionApi();
