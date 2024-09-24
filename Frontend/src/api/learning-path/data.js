const learningSequenceCourseInfo = {
  "data": {
    "currentCourseOrder": 7,
    "courses": Array.from({ length: 30 }, (_, i) => i + 1).map(e => ({
      "id": e + 1,
      "name": "Course " + String(e),
      "description": "no description",
      "lessonsCount": 3,
      "time": 2.5,
      "score": e == 8 ? 50 : e < 8 ? 100 : 0
    }))
  }
}

export {learningSequenceCourseInfo};