const LOs = [];

for (let i = 1; i <= 50; i++) {
  LOs.push({
    id: i,
    topic: `Topic ${i}`,
    learningObject: `Learning Object ${i}`,
    finished: i == 20 ? 50 : i < 20 ? 100 : 0,
  });
}

export const baseInfoLearningPath = {
  "learningStyle": [-2,1,0,2],
  "backgroundKnowledge": "INTERMEDIATE",
  "qualification": "GRADUATE"
}

export {LOs};