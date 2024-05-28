import os
import uuid
import time
import pandas as pd
from datetime import datetime
from flask import Blueprint, jsonify, request
import pyarrow.parquet as pq
import pyarrow as pa
from app.const import collected_activations_folder_path, collected_activations_list_file_path, labels_file_path, prompts_file_path
from app.llm import LLM

collect_activations_bp = Blueprint('collect_activations_bp', __name__)

@collect_activations_bp.route('/api/collect-activations', methods=['POST'])
def collect_activations():
    llm_max_generated_tokens_count = 40

    data = request.get_json()
    
    if not all(key in data for key in ['label_id', 'prompt_id', 'layers', 'token_options']):
        return jsonify({ 'message': 'Failure', 'error': 'Error: Not all arguments were provided' })
    
    label_id = data['label_id']
    prompt_id = data['prompt_id']
    layers = data['layers']
    token_options = data['token_options']
    
    if not os.path.exists("./data"):
        os.makedirs("./data")
        
    if not os.path.exists("./data/analyse"):
        os.makedirs("./data/analyse")
        
    if not os.path.exists(collected_activations_folder_path):
        os.makedirs(collected_activations_folder_path)
        
    start_time = time.time()
    
    
    
    # Read or Create Collected Activations List
    last_seed = 0
    
    if os.path.exists(collected_activations_list_file_path):
        collected_activations_list_df = pd.read_parquet(collected_activations_list_file_path)
    else:
        print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Creating Collected Activations List...")
        collected_activations_list_df = pd.DataFrame({'id': [], 'label_id': [], "prompt_id": [], "layers": [], "token_options": [], "last_seed": [] })
    
    if len(collected_activations_list_df) != 0:
        collected_activations_list_df_matches = collected_activations_list_df[
            (collected_activations_list_df['label_id'] == label_id) & 
            (collected_activations_list_df['prompt_id'] == prompt_id) & 
            (collected_activations_list_df['layers'] == layers) & 
            (collected_activations_list_df['token_options'] == token_options)
            ]
    else:
        collected_activations_list_df_matches = False

    if collected_activations_list_df_matches is not False and not collected_activations_list_df_matches.empty:
        row_index = collected_activations_list_df_matches.index[0]
        last_seed = collected_activations_list_df.iloc[row_index]['last_seed']
    else:
        label_prompt_row = { 'id': str(uuid.uuid4()), 'label_id': label_id, 'prompt_id': prompt_id, "layers": layers, 'token_options': token_options, 'last_seed': 0 }
        collected_activations_list_df.loc[len(collected_activations_list_df)] = label_prompt_row
        row_index = len(collected_activations_list_df) - 1
        
    curr_seed = last_seed + 1
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Current Seed: ", curr_seed)
    
    
    
    # Get Prompt and Label
    if os.path.exists(labels_file_path):
        labels_df = pd.read_parquet(labels_file_path)
        try:
            label_row = labels_df[labels_df['id'] == str(label_id)].iloc[0]
            label = str(label_row['name'])
        except:
            return jsonify({ 'message': 'Failure', 'error': 'Error: Label not found' })
    else:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Labels file not found' })
    
    # Read or Create Labels File
    if os.path.exists(prompts_file_path):
        prompts_df = pd.read_parquet(prompts_file_path)
        try:
            prompt_row = prompts_df[prompts_df['id'] == str(prompt_id)].iloc[0]
            prompt_template = str(prompt_row["name"])
        except:
            return jsonify({ 'message': 'Failure', 'error': 'Error: Label not found' })
    else:
        return jsonify({ 'message': 'Failure', 'error': 'Error: Prompts file not found' })
    
    
    
    # Generate
    llm = LLM()
    llm.set_default_gen_values()
    llm.set_collect_values(int(curr_seed), int(layers.split("-")[0]), int(layers.split("-")[1]))
    label_token = " <|label|> "
    
    lower_alphabet = "abcdefghijklmnopqrstuvwxyz"
    pseudorandom_string = "".join([
        lower_alphabet[curr_seed % len(lower_alphabet)],
        str(curr_seed),
        lower_alphabet[curr_seed % len(lower_alphabet)],
        str(curr_seed - 1),
        str(curr_seed - 2),
        lower_alphabet[(curr_seed + 1) % len(lower_alphabet)],
        lower_alphabet[(curr_seed + 2) % len(lower_alphabet)],
        str(curr_seed + 1),
        str(curr_seed + 2),
        lower_alphabet[(curr_seed - 1) % len(lower_alphabet)],
        lower_alphabet[(curr_seed - 2) % len(lower_alphabet)]
    ])
    
    messages = llm.tokenizer.apply_chat_template([{ "role": "user", "content": pseudorandom_string + " " + prompt_template.replace(label_token, label) }], tokenize=False, add_generation_prompt=True)
    input_ids = llm.tokenizer(messages, return_tensors="pt").to(llm.device)
    max_length = len(input_ids[0]) + llm_max_generated_tokens_count
    result_container = {"result": None, "done": False}

    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Generating...")
    llm.generate(input_ids, max_length, result_container, False)
    result = result_container["result"]
    
    decoded_output = []
    for token_id in result[0][len(input_ids[0]):]:
        decoded_output.append(llm.tokenizer.decode([token_id], skip_special_tokens=True))
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Generated Response: ", ''.join(decoded_output))
    
    
    
    # Process Activations
    activations = llm.down_outputs.copy()
    if not os.path.exists(collected_activations_folder_path):
        os.makedirs(collected_activations_folder_path)
        
    # Saves Activations with Seed File Name in folder of collection_id
    collection_id = collected_activations_list_df.iloc[row_index]['id']
    if not os.path.exists(collected_activations_folder_path + "/" + str(collection_id)):
        os.makedirs(collected_activations_folder_path + "/" + str(collection_id))
        
    down_outputs_size = len(activations[0]) - 3
    columns = ["seed", "token", "layer"] + [f'n{i}' for i in range(down_outputs_size)]
    
    words = [label] + [word.strip() for word in label_row['word_variants'].split(',')]
    activations = get_subset_of_activations(llm, activations, decoded_output, words, token_options)
    activations_df = pd.DataFrame(activations, columns=columns)
    
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Saving Activations...")
    activations_temp_file_name = collected_activations_folder_path + "/" + str(collection_id) + '/temp.parquet'
    activations_df.to_parquet(activations_temp_file_name)
    print(datetime.now().strftime("%H:%M:%S:%f")[:-3] + " - ", "Saved Activations.")
    
    activations_file_size_kb = 0
    current_activations_file_name, current_activations_file_number, current_activations_file_size = get_current_activations_file_size(collected_activations_folder_path + "/" + str(collection_id))
    if current_activations_file_name != -1 and current_activations_file_size < 1 * 1024 * 1024 * 1024:
        # Combine Current and Temp Files
        current_activations_table = pq.read_table(current_activations_file_name)
        activations_temp_table = pq.read_table(activations_temp_file_name)
        new_activations_table = pa.concat_tables([current_activations_table, activations_temp_table])
        
        os.remove(current_activations_file_name)
        os.remove(activations_temp_file_name)
        
        new_current_activations_file_name = collected_activations_folder_path + "/" + str(collection_id) + '/new.parquet'
        pq.write_table(new_activations_table, new_current_activations_file_name)
        os.rename(new_current_activations_file_name, current_activations_file_name)
        
        if os.path.exists(current_activations_file_name):
            activations_file_size_kb = (os.path.getsize(current_activations_file_name) - current_activations_file_size) / 1024
    else:
        # Rename Temp to New File
        activations_new_file_path = collected_activations_folder_path + "/" + str(collection_id) + '/' + str(current_activations_file_number + 1) + '.parquet'
        os.rename(activations_temp_file_name, activations_new_file_path)
        
        if os.path.exists(activations_new_file_path):
            activations_file_size_kb = os.path.getsize(activations_new_file_path) / 1024
    
    
    
    # Save Collected Activations List
    collected_activations_list_df.at[row_index, 'last_seed'] = curr_seed
    collected_activations_list_df.to_parquet(collected_activations_list_file_path)
    
    
    
    # Calculate Runtime
    elapsed_time = time.time() - start_time
    
    
    
    return jsonify({ 'message': 'Success', 'current_seed': int(curr_seed), 'elapsed_time': int(elapsed_time), 'activations_file_size_kb': int(activations_file_size_kb) })



def get_subset_of_activations(llm, activations, decoded_output, words, collecting_tokens_count = 1):
    lower_decoded_output = [token.strip().lower() for token in decoded_output]
    
    words_tokens = {}
    for word in words:
        tokens = llm.tokenizer(word, add_special_tokens=False)['input_ids']
        words_tokens[word] = [llm.tokenizer.decode([token_id]).strip().lower() for token_id in tokens]
        
    token_indexes = []
    keyword_tokens = []
    for _, word_tokens in words_tokens.items():
        i = 0
        while i <= len(lower_decoded_output) - len(word_tokens):
            if lower_decoded_output[i:i + len(word_tokens)] == word_tokens:
                if collecting_tokens_count == "all":
                    token_count = len(word_tokens)
                else:
                    token_count = min(len(word_tokens), int(collecting_tokens_count))
                token_indexes.extend(list(range(i, i + token_count)))
                keyword_tokens.extend(word_tokens)
                i += len(word_tokens) - 1
            i += 1
    
    new_activations = []
    for activations_item in activations:
        if activations_item[1] in token_indexes:
            activations_item[1] = keyword_tokens[token_indexes.index(activations_item[1])]
            new_activations.append(activations_item)

    return new_activations



def get_current_activations_file_size(folder_path):
    current_activations_file_number = -1

    for file_name in os.listdir(folder_path):
        if file_name.endswith('.parquet'):
            try:
                number = int(file_name[:-8])
                if number > current_activations_file_number:
                    current_activations_file_number = number
            except:
                continue
            
    if current_activations_file_number == -1:
        return -1, -1, -1

    current_activations_file_name = folder_path + '/' + str(current_activations_file_number) + '.parquet'
    current_activations_file_size = os.path.getsize(folder_path + "/" + str(current_activations_file_number) + ".parquet")
    
    return current_activations_file_name, current_activations_file_number, current_activations_file_size
