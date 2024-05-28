import os
import pandas as pd
from flask import Blueprint, request, jsonify
from app.const import chat_messages_folder_path

get_chat_messages_bp = Blueprint('get_chat_messages_bp', __name__)

@get_chat_messages_bp.route('/api/chat-messages', methods=['GET'])
def get_chat_messages():
    conversation_id = request.args.get('conversation_id', False)
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    # Read or Create Messages File
    if not os.path.exists(chat_messages_folder_path):
        os.makedirs(chat_messages_folder_path)
        
    if not os.path.exists(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet"):
        messages = pd.DataFrame({'conversation_id': [], 'message_id': [], "sent_time": [], "sender": [], "text": [] })
        messages.to_parquet(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
    else:
        messages = pd.read_parquet(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
    
    
    
    messages_json = messages.to_json(orient='records')
    
    return jsonify({ 'message': 'Success', 'messages': messages_json })
