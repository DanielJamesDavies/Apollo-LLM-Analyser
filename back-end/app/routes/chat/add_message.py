import os
import time
import uuid
import pandas as pd
import threading
import torch
import json
from datetime import datetime
from flask import Blueprint, request, jsonify, Response
from app.const import conversations_file_path, chat_messages_folder_path, chat_activations_folder_path
from app.llm import LLM



add_message_bp = Blueprint('add_message_bp', __name__)



title_gen_prompt = " ".join([
    "Please start your response with the tag \"TITLE: \" and then write the concise title with perfect title capitalisation.",
    "After the perfect title, do a line break and then wait for my next message.",
    "Please be specific and concise and just reply in plain text with no formatting.",
    "The title is less than 7 words, very sensible, makes sense, easy to understand at a glance, and answers the question, what is the topic?",
    "Thank you so much! So what's the really concise title?"
])



@add_message_bp.route('/api/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    
    if "prompt" not in data:
        return jsonify({"error": "Request must contain a prompt"}), 400
    
    return Response(generate_message(data), mimetype='application/json')

    
    
    
    
def generate_message(data):
    conversation_id = False
    is_new_conversation = False
    
    if "conversation_id" in data:
        conversation_id = data["conversation_id"]
        
    if conversation_id is False:
        conversation_id = uuid.uuid4()
        is_new_conversation = True
    
    llm_generated_tokens_count = 256
    
    if "llm_generated_tokens_count" in data:
        llm_generated_tokens_count = min([512, data["llm_generated_tokens_count"]])
    
    prompt = data["prompt"]
    messages = [{ "role": "user", "content": prompt }]
    
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Chat New Message: ", prompt)
    
    
    
    # Get Previous Messages
    if conversation_id is not False and os.path.exists(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet"):
        messages_df = pd.read_parquet(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
        messages_df['role'] = messages_df['sender']
        messages_df['content'] = messages_df['text']
        messages_df = messages_df[['role', 'content']]
        messages = messages_df.to_dict(orient='records')
        for message in messages:
            if message['role'] == 'model':
                message['content'] = ''.join(json.loads(message['content'])['content'])
        messages = messages + [{ "role": "user", "content": prompt }]
    
    
    
    # Generate Response
    yield json.dumps({"data": ["generating"] }) + '\n'
    llm = LLM()
    response = ""
    for res in generate_response(llm, messages, llm_generated_tokens_count, conversation_id, is_new_conversation):
        yield json.dumps({"data": [res] }) + '\n'
        response = res
    response_text = ''.join(json.loads(response)['content'])
    print("Response:", response_text)
    updated_time = time.time()
    
    

    if not os.path.exists("./data"):
        os.makedirs("./data")
    
    if not os.path.exists(chat_messages_folder_path):
        os.makedirs(chat_messages_folder_path)



    # If New Conversation
    if is_new_conversation:
        # Generate Conversation Title
        conversation_title = generate_title(llm, messages, response_text)
        
        
        
        # Add Conversation to Conversations
        new_conversations_data = pd.DataFrame({'id': [conversation_id], 'title': [conversation_title], "updated_time": [updated_time] })
        new_conversations_data['id'] = new_conversations_data['id'].astype(str)
        
        if os.path.exists(conversations_file_path):
            conversations_df = pd.read_parquet(conversations_file_path)
            new_conversations_df = pd.concat([conversations_df, new_conversations_data], ignore_index=True)
        else:
            new_conversations_df = new_conversations_data
            
        new_conversations_df.to_parquet(conversations_file_path)
    
    
    
        # Create New Messages
        messages = pd.DataFrame({'conversation_id': [], 'message_id': [], "sent_time": [], "sender": [], "text": [] })
    else:
        
        # Update Conversation Updated Time     
        if os.path.exists(conversations_file_path):
            new_conversations_df = pd.read_parquet(conversations_file_path)
            new_conversations_df.loc[new_conversations_df['id'] == str(conversation_id), 'updated_time'] = updated_time
            conversation_title = new_conversations_df.loc[new_conversations_df['id'] == str(conversation_id), 'title'].values[0]
        else:
            # Generate Conversation Title
            conversation_title = generate_title(llm, messages, response_text)
        
            new_conversations_df = pd.DataFrame({'id': [conversation_id], 'title': [conversation_title], "updated_time": [updated_time] })
            new_conversations_df['id'] = new_conversations_df['id'].astype(str)

        new_conversations_df.to_parquet(conversations_file_path)
        
        
        
        # Get Previous Messages
        if not os.path.exists(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet"):
            messages = pd.DataFrame({'conversation_id': [], 'message_id': [], "sent_time": [], "sender": [], "text": [] })
        else:
            messages = pd.read_parquet(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
    
    
    
    # Save Messages
    latest_messages = pd.DataFrame({'conversation_id': [conversation_id, conversation_id], 'message_id': [uuid.uuid4(), uuid.uuid4()], "sent_time": [updated_time, updated_time], "sender": ["user", "model"], "text": [prompt, response] })
    new_messages = pd.concat([messages, latest_messages], ignore_index=True)
    new_messages['conversation_id'] = new_messages['conversation_id'].astype(str)
    new_messages['message_id'] = new_messages['message_id'].astype(str)
    new_messages.to_parquet(chat_messages_folder_path + "/" + str(conversation_id) + ".parquet")
    
    
        
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Completed Generation.")

    yield json.dumps({"data": { 'message': 'Success', 'response': response, 'conversation_id': str(conversation_id), "conversation_title": conversation_title, "updated_time": updated_time }}) + '\n'





def generate_response(llm, messages, llm_generated_tokens_count, conversation_id, should_generate_title):
    llm.set_default_gen_values()
    torch.cuda.empty_cache()
    
    # Get Activations & Message Index
    if os.path.exists(chat_activations_folder_path + "/" + str(conversation_id) + '.parquet'):
        activations_df = pd.read_parquet(chat_activations_folder_path + "/" + str(conversation_id) + '.parquet')
        llm.current_message_index = activations_df['message'].iloc[-1] + 1
    else:
        activations_df = False
        llm.current_message_index = 0
    
    prompt = llm.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    input_ids = llm.tokenizer(prompt, return_tensors="pt").to(llm.device)

    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Generating...")
    max_length = len(input_ids[0]) + llm_generated_tokens_count
    result_container = {"result": None, "done": False}
    
    generate_thread = threading.Thread(target=model_generate, args=(input_ids, max_length, result_container, should_generate_title))
    generate_thread.start()
    
    time.sleep(7)

    while not result_container["done"]:
        if conversation_id:
            entire_generated_text = llm.get_entire_generated_text()
            yield json.dumps({ "text": entire_generated_text })
        time.sleep(1)
    
    result = result_container["result"]
    
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Getting Decoded Output...")
    if conversation_id:
        decoded_output = []
        for token_id in result[0][len(input_ids[0]):]:
            decoded_output.append(llm.tokenizer.decode([token_id], skip_special_tokens=True))
        decoded_output = json.dumps({ "content": decoded_output })
        yield decoded_output
        
        save_activations_to_df(conversation_id, llm.down_outputs.copy(), activations_df)
        return decoded_output
    else:
        decoded_output = llm.tokenizer.decode(result[0][len(input_ids[0]):], skip_special_tokens=True)
        return decoded_output





def model_generate(input_ids, max_length, result_container, should_generate_title):
    llm = LLM()
    response = llm.generate(input_ids, max_length, result_container, should_generate_title)
    return response





def save_activations_to_df(conversation_id, activations, activations_df):
    message_index = 0
    
    if not os.path.exists(chat_activations_folder_path):
        os.makedirs(chat_activations_folder_path)
        
    down_outputs_size = len(activations[0]) - 3
    columns = ["message", "token", "layer"] + [f'n{i}' for i in range(down_outputs_size)]
    
    if activations_df is False:
        activations_df = pd.DataFrame(columns=columns)
    
    data = activations_df.to_numpy().tolist()

    if len(data) == 0:
        data = activations
    else:
        data = data + activations
    df = pd.DataFrame(data, columns=columns)
    
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Saving Activations...")

    df.to_parquet(chat_activations_folder_path + "/" + str(conversation_id) + '.parquet')
    
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Saved Activations.")





def generate_title(llm, messages, response_text):
    print("Generating Title...")
    
    title_messages = messages + [{ "role": "model", "content": response_text }, { "role": "user", "content": title_gen_prompt }]
    title_prompt = llm.tokenizer.apply_chat_template(title_messages, tokenize=False, add_generation_prompt=True)
    title_input_ids = llm.tokenizer(title_prompt, return_tensors="pt").to(llm.device)
    
    with torch.no_grad():
        title_result = llm.model.generate(**title_input_ids, max_length=len(title_input_ids[0]) + 15, past_key_values=llm.past_key_values)
        
    conversation_title = llm.tokenizer.decode(title_result[0][len(title_input_ids[0]):], skip_special_tokens=True)
    print("Raw Conversation Title: ", conversation_title)
    
    conversation_title = ' '.join(conversation_title.strip().split("ITLE:")[1].split("\n")[0].strip().lstrip("*").rstrip("*").strip().split()).rstrip(".")
    print("Generated Title.")
    
    return conversation_title
