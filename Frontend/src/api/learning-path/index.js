import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/sequenceCourses`;

class LearningPathApi {
  getSequenceCouresByLearnerId(queryParams) {
    return axios.get(apiUrl, { params: queryParams })
    //return Promise.resolve(deepCopy(learningSequenceCourseInfo));
  }

  getSequenceCoures() {
    return axios.get(apiUrl)
    //return Promise.resolve(deepCopy(learningSequenceCourseInfo));
  }

  createSequenceCoures(request) {
    return axios.post(apiUrl, request)
    //return Promise.resolve(deepCopy(learningSequenceCourseInfo));
  }

  updateSequenceCoures(typeLearnerId, request) {
    return axios.put(`${apiUrl}/:${typeLearnerId}`, request)
    //return Promise.resolve(deepCopy(learningSequenceCourseInfo));
  }
}

export const learningPathApi = new LearningPathApi();