import os
import numpy as np
import pandas as pd
from flask import Blueprint, jsonify, request
from app.const import models_folder_path, logistic_regression_models_folder_path, collected_activations_folder_path
from app.models.logistic_regression import LogisticRegression

get_activation_space_log_reg_model_bp = Blueprint('get_activation_space_log_reg_model_bp', __name__)

@get_activation_space_log_reg_model_bp.route('/api/activation-space-log-reg', methods=['GET'])
def get_activation_space_log_reg_model():
    try:
        layer = int(request.args.get('layer', -1))
    except:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Invalid arguments were provided' })
    
    if layer == -1:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Layer parameter not provided' })
        
    should_retrain = request.args.get('retrain', 'false').lower() == "true"
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
    
    if not os.path.exists(models_folder_path):
        os.makedirs(models_folder_path)
    
    if not os.path.exists(logistic_regression_models_folder_path):
        os.makedirs(logistic_regression_models_folder_path)
        
    activation_space_models_folder = logistic_regression_models_folder_path + "/activation-space"
    
    if not os.path.exists(activation_space_models_folder):
        os.makedirs(activation_space_models_folder)
        
    model_file_path = activation_space_models_folder + "/" + "l" + str(layer) + ".npy"
    
    if not os.path.exists(model_file_path) or should_retrain:
        # Create New Model
        
        # Hyperparameters
        epochs = 1000
        
        # Data
        x_train, y_train = get_dataset(layer)
        
        # Create Model
        activation_space_model = LogisticRegression(feature_count=x_train.shape[1], learning_rate=0.01)
        
        # Training
        for epoch in range(epochs):
            for i in range(len(x_train)):
                activation_space_model.train(x_train[i], y_train[i])
        
        # Save the model
        activation_space_model.save(model_file_path)
    else:
        # Load Model
        activation_space_model = LogisticRegression(0)
        activation_space_model.load(model_file_path)
    
    return jsonify({ 'message': 'Success', 'weights': list(activation_space_model.get_weights()) })



def get_dataset(layer):
    x_train = []
    y_train = []
    f1 = False

    for f in os.listdir(collected_activations_folder_path):
        if f1 is False:
            f1 = f
        if os.path.isdir(os.path.join(collected_activations_folder_path, f)):
            for file_name in os.listdir(os.path.join(collected_activations_folder_path, f)):
                if file_name.endswith('.parquet'):
                    df = pd.read_parquet(collected_activations_folder_path + "/" + f + "/" + file_name)
                    rows = df[df['layer'] == int(layer)]
                    for _, row in rows.iterrows():
                        x_train.append(row.tolist())
                        y_train.append(1 if f == f1 else 0)
                        
    return np.array(x_train), np.array(y_train)
