from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from ontology import *
from database import *
from forum import *
import json
import os

pythonServer = Path(__file__).resolve().parent
systemOntology = pythonServer / 'ontology'

class LearningStyle:
    def __init__(self, query):
        self.qualification = query['qualification'][0]
        self.backgroundKnowledge = query['background_knowledge'][0]
        self.active_reflective = query['active_reflective'][0]
        self.visual_verbal = query['visual_verbal'][0]
        self.global_sequential = query['global_sequential'][0]
        self.sensitive_intuitive = query['sensitive_intuitive'][0]

class RequestHandler(BaseHTTPRequestHandler):
    def send_reponse(self, status, type, response):
        self.send_response(status)
        self.send_header('Content-Type', type)
        self.end_headers()
        self.wfile.write(response)
        
    def do_GET(self):
        if self.path == '/spraql-topic':
            json_path = systemOntology / 'json' / 'paths.json'
            try:
                with open(json_path, 'r') as json_file:
                    paths = json.load(json_file)
                json_string = json.dumps(paths)
                self.send_reponse(200, 'application/json', json_string.encode('utf-8'))
            except FileNotFoundError:            
                self.send_reponse(404, 'text/html', b'File not found')
                
        elif '/spraql-lm' in self.path:
            query = parse_qs(urlparse(self.path).query)
            SpraqlTopic(query["start"][0], query["end"][0], systemOntology / 'rdf' /'topic-onto.rdf' ).spraqlTopic()
            learningSytle = LearningStyle(query)
            paths = SpraqlLM(systemOntology / 'rdf' / 'system-onto.rdf').spraql_lm(learningSytle)
            self.send_reponse(200, 'application/json', json.dumps(paths[0]).encode('utf-8'))
        
        elif '/topic-ontology' in self.path:
            TopicOntology().addOnto()
            self.send_reponse(200, 'text/html', b'Regenerate topic-ontology successfully')
            
        elif '/system-ontology' in self.path:
            SystemOntology().addOnto()
            self.send_reponse(200, 'text/html', b'Regenerate system-ontology successfully')
            
        elif '/feature-test' in self.path:
            self.send_reponse(200, 'text/html', b'Feature test')
            
        else:
            self.send_reponse(404, 'text/html', b'HELLO FROM PYTHON SERVER')
            
    def do_POST(self):
        if self.path == '/similar-forums':
            content_len = int(self.headers.get('Content-Length'))
            post_body = self.rfile.read(content_len).decode('utf-8')
            forums = ForumService.findSimilarForums(post_body)
            self.send_reponse(200, 'application/json', json.dumps(forums).encode('utf-8'))    

def main():
    PORT = 8181
    server  = HTTPServer(("", PORT), RequestHandler)
    print("Ontology server is listening on port:", PORT)
    server.serve_forever()  
    
if __name__ == "__main__":
    main()