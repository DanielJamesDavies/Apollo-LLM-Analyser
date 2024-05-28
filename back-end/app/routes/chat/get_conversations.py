import os
import pandas as pd
from flask import Blueprint, jsonify
from app.const import conversations_file_path

get_conversations_bp = Blueprint('get_conversations_bp', __name__)

@get_conversations_bp.route('/api/conversations', methods=['GET'])
def get_conversations():
    if not os.path.exists("./data"):
        os.makedirs("./data")
    
    
    
    # Read or Create Conversations File
    if os.path.exists(conversations_file_path):
        conversations = pd.read_parquet(conversations_file_path)
    else:
        conversations = pd.DataFrame({'id': [], 'title': [], "updated_time": [] })
    
    
    
    conversations_json = conversations.to_json(orient='records')
    
    return jsonify({ 'message': 'Success', 'conversations': conversations_json })
