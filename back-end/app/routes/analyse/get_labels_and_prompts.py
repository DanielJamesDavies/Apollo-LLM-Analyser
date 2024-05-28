import os
import pandas as pd
from flask import Blueprint, jsonify
from app.const import labels_file_path, prompts_file_path

get_labels_and_prompts_bp = Blueprint('get_labels_and_prompts_bp', __name__)

@get_labels_and_prompts_bp.route('/api/labels-and-prompts', methods=['GET'])
def get_labels_and_prompts():
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
    
    # Read or Create Labels File
    if os.path.exists(labels_file_path):
        labels_df = pd.read_parquet(labels_file_path)
        labels_json = labels_df.to_json(orient='records')
    else:
        labels_json = "[]"
    
    # Read or Create Labels File
    if os.path.exists(prompts_file_path):
        prompts_df = pd.read_parquet(prompts_file_path)
        prompts_json = prompts_df.to_json(orient='records')
    else:
        prompts_json = "[]"
        
    print("labels_json", labels_json)
    print("prompts_json", prompts_json)
    
    return jsonify({ 'message': 'Success', 'labels': labels_json, 'prompts': prompts_json })
