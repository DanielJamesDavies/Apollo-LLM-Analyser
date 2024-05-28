import os
from flask import Flask
from flask_cors import CORS
import torch
from accelerate import Accelerator
from app.llm import LLM

model_name = "google/gemma-7b-it"
model_layer_count = 28

def create_app():
    print("Creating App...")
    app = Flask(__name__)
    CORS(app)
    
    
    os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'max_split_size_mb:128'
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
    
    
    llm = LLM()
    
    
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print("Using Device:", llm.device)
    
    
    # Register Chat Blueprints
    from app.routes.chat.add_message import add_message_bp
    app.register_blueprint(add_message_bp)
    
    from app.routes.chat.get_conversations import get_conversations_bp
    app.register_blueprint(get_conversations_bp)
    
    from app.routes.chat.get_chat_messages import get_chat_messages_bp
    app.register_blueprint(get_chat_messages_bp)
    
    from app.routes.chat.get_chat_activations import get_chat_activations_bp
    app.register_blueprint(get_chat_activations_bp)
    
    from app.routes.chat.delete_chat_conversation import delete_chat_conversation_bp
    app.register_blueprint(delete_chat_conversation_bp)
    
    
    # Register Analyse Blueprints
    from app.routes.analyse.get_labels_and_prompts import get_labels_and_prompts_bp
    app.register_blueprint(get_labels_and_prompts_bp)
    
    from app.routes.analyse.save_labels_and_prompts import save_labels_and_prompts_bp
    app.register_blueprint(save_labels_and_prompts_bp)
    
    from app.routes.analyse.collect_activations import collect_activations_bp
    app.register_blueprint(collect_activations_bp)
    
    from app.routes.analyse.get_neuron_activations import get_neuron_activations_bp
    app.register_blueprint(get_neuron_activations_bp)
    
    from app.routes.analyse.get_collection_list import get_collection_list_bp
    app.register_blueprint(get_collection_list_bp)
    
    from app.routes.analyse.get_activation_space_log_reg_model import get_activation_space_log_reg_model_bp
    app.register_blueprint(get_activation_space_log_reg_model_bp)
    
    from app.routes.analyse.get_tsne_activations import get_tsne_activations_bp
    app.register_blueprint(get_tsne_activations_bp)
    
    
    return app
