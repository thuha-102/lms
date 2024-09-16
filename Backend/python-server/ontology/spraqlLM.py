import rdflib
import os
import json

class Style:
    def __init__(self):
        self.qualification = "Graduate"
        self.backgroundKnowledge = "Basic"
        self.active_reflective = "0"
        self.visual_verbal = "1"
        self.global_sequential = "1"
        self.sensitive_intuitive = "0"
        
class SpraqlLM:
    def __init__(self, path):
        self.g = rdflib.Graph()
        self.g.parse(path, format="xml")


    def getLMtopic(self, topicID):
        sparql_query = f"""
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xml: <http://www.w3.org/XML/1998/namespace>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX onto: <http://www.semanticweb.org/thuha/ontologies/system-ontology#>
            BASE <http://www.semanticweb.org/thuha/ontologies/system-ontology/>
            SELECT *
            WHERE
            {{
                ?lm onto:topic "{topicID}".
                ?lm onto:lmID ?lmID.
                ?lm onto:material_ratings ?rating.
                ?lm onto:score ?maxScore.
                ?lm onto:time ?maxTime.
                ?lm onto:difficulty ?difficult.
            }}
        """
        qres = self.g.query(sparql_query)
        lms = []
        for row in qres:
            lms += [(float(row["rating"].value), 0, row["lmID"].value)]

        return lms

    def spraql_lm(self, learningStyle):
        result = []
        sparql_query = f"""
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xml: <http://www.w3.org/XML/1998/namespace>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX onto: <http://www.semanticweb.org/thuha/ontologies/system-ontology#>
            BASE <http://www.semanticweb.org/thuha/ontologies/system-ontology/>
            SELECT *
            WHERE
            {{
                ?learner onto:qualification "{learningStyle.qualification}".
                ?learner onto:backgroundKnowledge "{learningStyle.backgroundKnowledge}".
                ?learner onto:active_reflective "{learningStyle.active_reflective}".
                ?learner onto:visual_verbal "{learningStyle.visual_verbal}".
                ?learner onto:sequential_global "{learningStyle.global_sequential}".
                ?learner onto:sensitive_intuitive "{learningStyle.sensitive_intuitive}".
                ?learner onto:learnerID ?learnerID.
                ?log onto:learnerID ?learnerID.
                ?log onto:lmID ?lmID.
                ?log onto:attempt ?attempt.
                ?log onto:score ?score.
                ?log onto:time ?time.
                ?lm onto:lmID ?lmID.
                ?lm onto:material_ratings ?rating.
                ?lm onto:topic ?topicID.
                ?lm onto:score ?maxScore.
                ?lm onto:time ?maxTime.
                ?lm onto:difficulty ?difficulty.
            }}
        """

        qres = self.g.query(sparql_query)

        with open(os.path.dirname(os.path.abspath(__file__)) + '/json/paths.json', 'r') as json_file:
            paths = [] if json_file is None else json.load(json_file)

        for path in paths: 
            lms = {}
            topics = {}
            for topic in path:
                topics[topic] = []

            for row in qres:
                if row["topicID"].value not in topics:
                    continue
                
                topicID = row["topicID"].value
                lmID = row["lmID"].value
                rating = int(row["rating"].value)
                
                if lmID not in lms:
                    lms[lmID] = {
                        "score": float(row["score"].value),
                        "time": float(row["time"].value),
                        "attempt": int(row["attempt"].value),
                        "difficulty": float(row["difficulty"].value),
                        "rating": rating,
                        "topic": topicID,
                        "maxScore": float(row["maxScore"].value),
                        "maxTime": float(row["maxTime"].value),
                        "repeat": 1
                    }
                else:
                    lms[lmID]["score"] += float(row["score"].value)
                    lms[lmID]["time"] += float(row["time"].value)
                    lms[lmID]["attempt"] += int(row["attempt"].value)
                    lms[lmID]["repeat"] += 1

            for lm in lms:
                aScore = lms[lm]["score"]/lms[lm]["repeat"]
                aTime = lms[lm]["time"]/lms[lm]["repeat"]
                aAttempt = lms[lm]["attempt"]/lms[lm]["repeat"]
                
                similarity = abs(0.4*(aScore/lms[lm]["maxScore"]) + 0.3*(1.0 - aTime/lms[lm]["maxTime"]) + 0.3*(1.0 - aAttempt) - lms[lm]["difficulty"])
                topics[lms[lm]["topic"]] += [(lms[lm]["rating"], similarity, lm)]

            recommendTopicMaterial = []

            for topic in topics:
                
                if topics[topic] == []:
                    topics[topic] = self.getLMtopic(topic)
                    
                topics[topic].sort(key=lambda x: x[0], reverse=True)
                end = round(len(topics[topic])*0.2 + 0.5)
                topics[topic] = topics[topic][0:end]
                topics[topic].sort(key=lambda x: x[1]) # sort by similarity
                
                # print(topics[topic])
                # recommendTopicMaterial += [{
                #     "topic": topic,
                #     "learning_material": None if topics[topic] == [] else int(topics[topic][0][2])
                # }]
                recommendTopicMaterial += [None if topics[topic] == [] else int(topics[topic][0][2])]
                
            result += [[recommendTopicMaterial]]

        return result