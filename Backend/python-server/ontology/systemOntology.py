import json
import os
from database import *

class SystemOntology:
    def __init__(self):
        self.header = """<?xml version="1.0"?>
<rdf:RDF xmlns="http://www.semanticweb.org/thuha/ontologies/system-ontology/"
     xml:base="http://www.semanticweb.org/thuha/ontologies/system-ontology/"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:xml="http://www.w3.org/XML/1998/namespace"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
     xmlns:system-ontology="http://www.semanticweb.org/thuha/ontologies/system-ontology#">
    <owl:Ontology rdf:about="http://www.semanticweb.org/thuha/ontologies/system-ontology"/>\n\n\n"""
        self.footer = "</rdf:RDF>"

    def addLearner(self, newLearners):
        learners = ""
        
        for newLearner in newLearners:
            learner = f"""
        <owl:NamedIndividual rdf:about="http://www.semanticweb.org/thuha/ontologies/system-ontology#learner{'-' + str(newLearner[0])}">
            <rdf:type rdf:resource="http://www.semanticweb.org/thuha/ontologies/system-ontology#Learner"/>
            <system-ontology:learnerID>{newLearner[0]}</system-ontology:learnerID>
            <system-ontology:qualification>{newLearner[1]}</system-ontology:qualification>
            <system-ontology:backgroundKnowledge>{newLearner[2]}</system-ontology:backgroundKnowledge>
            <system-ontology:active_reflective>{newLearner[3]}</system-ontology:active_reflective>
            <system-ontology:visual_verbal>{newLearner[4]}</system-ontology:visual_verbal>
            <system-ontology:sequential_global>{newLearner[5]}</system-ontology:sequential_global>
            <system-ontology:sensitive_intuitive>{newLearner[6]}</system-ontology:sensitive_intuitive>
        </owl:NamedIndividual>



        """
            learners += learner
        
        return learners
    
    def addLog(self, newLogs):
        learner_logs = ""
        for newLog in newLogs:
            learner_log = f"""
        <owl:NamedIndividual rdf:about="http://www.semanticweb.org/thuha/ontologies/system-ontology#learning_log{'-' + str(newLog[0])}">
            <rdf:type rdf:resource="http://www.semanticweb.org/thuha/ontologies/system-ontology#Learner_Log"/>
            <system-ontology:learnerID>{newLog[7]}</system-ontology:learnerID>
            <system-ontology:lmID>{newLog[6]}</system-ontology:lmID>
            <system-ontology:score>{newLog[3]}</system-ontology:score>
            <system-ontology:time>{newLog[4]}</system-ontology:time>
            <system-ontology:attempt>{newLog[5]}</system-ontology:attempt>
        </owl:NamedIndividual>
        
        
        
        """
            learner_logs += learner_log
        
        return learner_logs


    def addLM(self, newLMs):
        learning_materials = ""
        for lm in newLMs:        
            learning_material = f"""
        
        
        <owl:NamedIndividual rdf:about="http://www.semanticweb.org/thuha/ontologies/system-ontology#learning_material{'-' + str(lm[0])}">
            <rdf:type rdf:resource="http://www.semanticweb.org/thuha/ontologies/system-ontology#Learning_Material"/>
            <system-ontology:difficulty>{lm[2]}</system-ontology:difficulty>
            <system-ontology:learning_resouce_type>{lm[3]}</system-ontology:learning_resouce_type>
            <system-ontology:lmID>{lm[0]}</system-ontology:lmID>
            <system-ontology:material_ratings>{lm[4]}</system-ontology:material_ratings>
            <system-ontology:score>{lm[5]}</system-ontology:score>
            <system-ontology:time>{lm[6]}</system-ontology:time>
            <system-ontology:topic>{lm[7]}</system-ontology:topic>
        </owl:NamedIndividual>
        
        
        
        """
            learning_materials += learning_material
            
        return learning_materials

    def addOnto(self):
        conn = connectDatabase()
        
        conn.cursor.execute("SELECT user_id, qualification, background_knowledge, active_reflective, visual_verbal, sequential_global, sensitive_intuitive FROM learners")
        learners = conn.cursor.fetchall()
        
        conn.cursor.execute("SELECT id, name, difficulty, type, rating, score, time, topic_id FROM learning_materials")
        lms = conn.cursor.fetchall()
        
        conn.cursor.execute("SELECT id, learning_material_visitted_time, learning_material_rating, score, time, attempts, learning_material_id, learner_id FROM learner_logs")
        logs = conn.cursor.fetchall()
        
        rdf_file = os.getcwd() + "/ontology/rdf/system-onto.rdf" 
        newOntology = self.header + self.addLM(lms) + self.addLog(logs) + self.addLearner(learners) + self.footer     
        with open(rdf_file, 'w') as file:
            file.write(newOntology)    