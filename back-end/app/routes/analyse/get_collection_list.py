import os
import pandas as pd
from flask import Blueprint, jsonify
from app.const import collected_activations_list_file_path

get_collection_list_bp = Blueprint('get_collection_list_bp', __name__)

@get_collection_list_bp.route('/api/collection-list', methods=['GET'])
def get_collection_list():
    if not os.path.exists("./data"):
        os.makedirs("./data")
    
    
    
    # Read or Create Collected Activations List File
    if os.path.exists(collected_activations_list_file_path):
        collected_activations_list = pd.read_parquet(collected_activations_list_file_path)
    else:
        collected_activations_list = pd.DataFrame({'id': [], 'label_id': [], "prompt_id": [], "layers": [], "token_options": [], "last_seed": [] })
    
    collected_activations_list_json = collected_activations_list.to_json(orient='records')
    
    
    
    return jsonify({ 'message': 'Success', 'collection_list': collected_activations_list_json })
