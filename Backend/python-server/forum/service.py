from sentence_transformers import SentenceTransformer, util
from database import *
# import time
# start_time = time.time()

class Service:
    def __init__(self) -> None:
        pass
    
    def findSimilarForums(content):   
        similarForums = []
        model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
        
        # Get all forums
        conn = connectDatabase()
        conn.cursor.execute("SELECT id, content, title FROM forums")
        rows = conn.cursor.fetchall()
        forums = [
            {
                "id": row[0],
                "content": row[1],
                "title": row[2]
            } for row in rows]
        
        # Encode the content
        embeddings_content = model.encode(content, convert_to_tensor=True)
        for forum in forums:
            embeddings_forum_content = model.encode(forum["content"], convert_to_tensor=True)
            
            # Count similarity score
            similarity_score = util.pytorch_cos_sim(embeddings_content, embeddings_forum_content)[0][0].item()
            # print(f"Similarity score to forum id {forum['id']}: {similarity_score}")
            if similarity_score >= 0.6:
                similarForums += [{"id": forum['id'], "title": forum['title'], "similarScore": similarity_score}]
        return similarForums