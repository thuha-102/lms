import axios from 'axios';
import { learningSequenceCourseInfo } from './data';
import { deepCopy } from '../../utils/deep-copy';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/sequenceCourses`;

class LearningPathApi {
  getSequenceCouresByLearnerId(learnerId) {
    return {
      "data": {
        "courses": []
      }
    }
    //return Promise.resolve(deepCopy(learningSequenceCourseInfo));
  }
}

export const learningPathApi = new LearningPathApi();