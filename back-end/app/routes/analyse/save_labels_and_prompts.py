import os
import pandas as pd
from flask import Blueprint, jsonify, request
from app.const import labels_file_path, prompts_file_path

save_labels_and_prompts_bp = Blueprint('save_labels_and_prompts_bp', __name__)

@save_labels_and_prompts_bp.route('/api/labels-and-prompts', methods=['PATCH'])
def save_labels_and_prompts():
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")

    json_data = request.get_json()
    labels = json_data.get('labels', [])
    prompts = json_data.get('prompts', [])
    
    # Save Labels File
    new_labels_df = pd.DataFrame(labels)
    new_labels_df.to_parquet(labels_file_path)
    
    # Save Prompts File
    new_prompts_df = pd.DataFrame(prompts)
    new_prompts_df.to_parquet(prompts_file_path)
    
    return jsonify({ 'message': 'Success' })
