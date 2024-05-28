import os
import pandas as pd
from flask import Blueprint, request, jsonify
from app.const import conversations_file_path, chat_messages_folder_path, chat_activations_folder_path

delete_chat_conversation_bp = Blueprint('delete_chat_conversation_bp', __name__)

@delete_chat_conversation_bp.route('/api/conversation', methods=['DELETE'])
def delete_chat_conversation():
    conversation_id = request.args.get('conversation_id', False)
    
    
    
    # Delete Messages File
    if not os.path.exists(chat_messages_folder_path):
        os.makedirs(chat_messages_folder_path)
        
    if os.path.exists(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet"):
        os.remove(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
    
    
    
    # Delete Activations File
    if not os.path.exists(chat_activations_folder_path):
        os.makedirs(chat_activations_folder_path)
        
    if os.path.exists(chat_activations_folder_path + "/" + str(conversation_id) + ".parquet"):
        os.remove(chat_activations_folder_path + "/" + str(conversation_id) + ".parquet")
    
    
    
    # Delete Conversation from Conversations
    if os.path.exists(conversations_file_path):
        new_conversations_df = pd.read_parquet(conversations_file_path)
        new_conversations_df = new_conversations_df[new_conversations_df['id'] != str(conversation_id)]
        new_conversations_df.to_parquet(conversations_file_path)
    
    
    
    return jsonify({ 'message': 'Success' })
