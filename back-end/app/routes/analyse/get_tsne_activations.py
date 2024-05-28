import os
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from app.const import collected_activations_folder_path
from sklearn.manifold import TSNE

get_tsne_activations_bp = Blueprint('get_tsne_activations_bp', __name__)

@get_tsne_activations_bp.route('/api/tsne-activations', methods=['GET'])
def get_tsne_activations():
    layer = request.args.get('layer', False)
    
    if layer is False:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Not all arguments were provided' })
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
    
    if not os.path.exists(collected_activations_folder_path):
        os.makedirs(collected_activations_folder_path)
        
    # Get Data
    activations = []
    collection_ids = []
    tokens = []
    
    for f in os.listdir(collected_activations_folder_path):
        if os.path.isdir(os.path.join(collected_activations_folder_path, f)):
            for file_name in os.listdir(collected_activations_folder_path + "/" + f):
                if file_name.endswith('.parquet'):
                    df = pd.read_parquet(collected_activations_folder_path + "/" + f + "/" + file_name)
                    rows = df[df['layer'] == int(layer)]
                    for index, row in rows.iterrows():
                        activations.append(row.drop(labels=['layer', 'token']).tolist())
                        collection_ids.append(f)
                        tokens.append(row['token'])
                        
    activations = np.array(activations)
    tokens = np.array(tokens)
    collection_ids = np.array(collection_ids)
    
                        
    # Get TSNE
    tsne = TSNE(n_components=2, random_state=12)
    tsne_data_2d = tsne.fit_transform(activations)
    tsne_data = np.hstack((collection_ids.reshape(-1, 1), tokens.reshape(-1, 1), tsne_data_2d)).tolist()
    
    
    # Array to JSON
    tsne_json = {}
    for row in tsne_data:
        collection_id = row[0]
        if collection_id not in tsne_json:
            tsne_json[collection_id] = []
        tsne_json[collection_id].append(row[1:])
    
    
    return jsonify({ 'message': 'Success', 'tsne_json': tsne_json })
