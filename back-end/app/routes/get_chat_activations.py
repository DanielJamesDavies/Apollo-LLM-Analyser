import os
import json
import pandas as pd
from flask import Blueprint, request, jsonify, Response
from app.const import chat_activations_folder_path

get_chat_activations_bp = Blueprint('get_chat_activations_bp', __name__)



@get_chat_activations_bp.route('/api/chat-activations', methods=['GET'])
def get_chat_activations():
    conversation_id = request.args.get('conversation_id', False)
    
    
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
    
    
    
    # Read or Create Activations File
    if not os.path.exists(chat_activations_folder_path):
        os.makedirs(chat_activations_folder_path)
        
    if not os.path.exists(chat_activations_folder_path + "/" + str(conversation_id) + ".parquet"):
        activations = False
    else:
        activations = pd.read_parquet(chat_activations_folder_path + "/" + str(conversation_id) + ".parquet").to_numpy().tolist()
        
    
        
    if activations is False:
        return jsonify({ 'message': 'Failure' })
        
    return Response(stream_activations_response(activations), mimetype='application/json')



def stream_activations_response(activations):
    chunk_size = 100
    first_chunk = True
    for i in range(0, len(activations), chunk_size):
        if first_chunk:
            chunk = [len(activations)] + activations[i:i + chunk_size]
            first_chunk = False
        else:
            chunk = activations[i:i + chunk_size]
        yield json.dumps({"data": chunk}) + '\n'
