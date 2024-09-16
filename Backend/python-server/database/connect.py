from time import strftime, localtime
import psycopg2
import json
from datetime import datetime
import os
from dotenv import load_dotenv
class Learner:
    def fromEntity(learner):
        birth_year = datetime.fromtimestamp(learner[1]/1000).year
        return {
            "id": learner[3],
            "name": learner[0],
            "age": datetime.now().year - birth_year,
            "gender": learner[2],
            "background_knowledge": learner[4],
            "qualification": learner[5],
            "active_reflective": learner[6],
            "global_sequential": learner[7],
            "sensitive_intuitive": learner[8],
            "visual_verbal": learner[9]   
        }

class LM:
    def fromEntity(lm):
        return {
            "id": lm[0],
            "name": lm[1],
            "difficulty": lm[2],
            "type": lm[3],
            "rating": lm[4],
            "score": lm[5],
            "time": lm[6]
        }
        
class Log:
    def fromEntity(log):
        return {
            "learning_material_visitted_time": log[0], "learning_material_rating": log[1], 
            "score": log[2], 
            "time": log[3], 
            "attempts": log[4],
            "learning_material_id": log[5], 
            "learner_id": log[6]
        }
        
class connectDatabase:
    def __init__(self):
        load_dotenv()
        print("Connect to database successfully")
        self.connection = psycopg2.connect(host=os.getenv("HOST"), database=os.getenv("DB"), user=os.getenv("DB_USERNAME"), password=os.getenv("DB_PASSWORD"))
        self.cursor = self.connection.cursor()
        
    def learners(self):
        query = "SELECT u.name, u.birth, u.gender, l.id, l.background_knowledge, l.qualification, l.active_reflective, l.global_sequential, l.sensitive_intuitive, l.visual_verbal FROM learners as l JOIN authenticated_user as u ON u.id = l.user_id"
        self.cursor.execute(query)
        learners = list(map(Learner.fromEntity, self.cursor.fetchall()))
        
        return json.dumps(learners)

    def lms(self):
        query = "SELECT id, name, difficultym, type, rating, score, time FROM learning_materials"
        
        self.cursor.execute(query)
        lms = list(map(LM.fromEntity, self.cursor.fetchall()))
        
        return json.dumps(lms)
    
    def logs(self):
        query = "SELECT learning_material_visitted_time, learning_material_rating, score, time, attempts, learning_material_id, learner_id"
        
        self.cursor.execute(query)
        logs = list(map(Log.fromEntity, self.cursor.fetchall()))
        
        return json.dumps(logs)
    
    def __del__(self):
        self.cursor.close()
        self.connection.close()