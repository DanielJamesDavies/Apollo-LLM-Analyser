import os
import pandas as pd
from flask import Blueprint, jsonify, request
from app.const import collected_activations_folder_path

get_neuron_activations_bp = Blueprint('get_neuron_activations_bp', __name__)

@get_neuron_activations_bp.route('/api/neuron-activations', methods=['GET'])
def get_neuron_activations():
    layer = request.args.get('layer', False)
    neuron = request.args.get('neuron', False)
    
    if layer is False or neuron is False:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Not all arguments were provided' })
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
    
    if not os.path.exists(collected_activations_folder_path):
        os.makedirs(collected_activations_folder_path)
        
    neuron_column_names = [("n" + str(n)) for n in neuron.split("-")]
    neuron_activations = {}
    columns = ["layer", "token"] + neuron_column_names
    
    for f in os.listdir(collected_activations_folder_path):
        if os.path.isdir(os.path.join(collected_activations_folder_path, f)):
            for file_name in os.listdir(collected_activations_folder_path + "/" + f):
                if file_name.endswith('.parquet'):
                    df = pd.read_parquet(collected_activations_folder_path + "/" + f + "/" + file_name, columns=columns)
                    rows = df[df['layer'] == int(layer)]
                    for index, row in rows.iterrows():
                        for i, n in enumerate(neuron_column_names):
                            if f not in neuron_activations:
                                neuron_activations[f] = []
                            neuron_activations[f].append([row[n] for n in (["token"] + neuron_column_names)])
    
    return jsonify({ 'message': 'Success', 'neuron_activations': neuron_activations })
