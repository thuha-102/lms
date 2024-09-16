import os
from database import *

class TopicOntology():
    def __init__(self):
        self.header = """<?xml version="1.0"?>
<rdf:RDF xmlns="http://www.semanticweb.org/thuha/topic-onto/"
    xml:base="http://www.semanticweb.org/thuha/topic-onto/"
    xmlns:owl="http://www.w3.org/2002/07/owl#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:xml="http://www.w3.org/XML/1998/namespace"
    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
    xmlns:topic-onto="http://www.semanticweb.org/thuha/topic-onto#">
    <owl:Ontology rdf:about="http://www.semanticweb.org/thuha/topic-onto"/>\n\n\n"""
        self.footer = "\n\n\n</rdf:RDF>"
        
    def addOnto(self):
        conn = connectDatabase()
        conn.cursor.execute("SELECT id, start_id, end_id FROM topic_link")
        links = conn.cursor.fetchall()
        
        topics = ""
        for row in links:
            if row[0] == "id_topic":
                continue

            topic = f"""
    <owl:NamedIndividual rdf:about="http://www.semanticweb.org/thuha/topic-onto#topic_link{row[0]}">
        <rdf:type rdf:resource="http://www.semanticweb.org/thuha/topic-onto#Topic"/>
        <topic-onto:topicID>{row[1]}</topic-onto:topicID>
        <topic-onto:link>{row[2]}</topic-onto:link>
    </owl:NamedIndividual>\n\n\n
        """
            topics += topic
                
        file_path = os.getcwd() + "/ontology/rdf/topic-onto.rdf"    
        modified_content = self.header + topics + self.footer

        with open(file_path, 'w') as file:
            file.write(modified_content)        