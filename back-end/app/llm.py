import torch
import threading
from transformers import AutoTokenizer, GemmaForCausalLM
from accelerate import Accelerator
import gc
import atexit

class LLM:
    _instance = None
    _lock = threading.Lock()
    _model_lock = threading.Lock()
    _data_lock = threading.Lock()

    class __LLM:
        def __init__(self, model_name="google/gemma-7b-it"):
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
            self.model_name = model_name
            self.layer_count = -1
            self.mode = "chat"
            self.down_outputs = []
            self.past_key_values = []
            self.entire_generated_text = []
            self.current_message_index = 0
            self.current_token_index = 0
            self.current_layer_index = 0
            self.collect_layer_min = -1
            self.collect_layer_max = -1
            self.current_seed = 0
            self.setup_model()

        def setup_model(self):
            torch.cuda.empty_cache()
            print("Setting Up Model...")
            try:
                self.model = GemmaForCausalLM.from_pretrained(self.model_name, device_map="auto", torch_dtype=torch.bfloat16, local_files_only=True, _fast_init=True)
            except:
                self.model = GemmaForCausalLM.from_pretrained(self.model_name, device_map="auto", torch_dtype=torch.bfloat16)

            self.layer_count = len(self.model.model.layers)
            self.collect_layer_min = 1
            self.collect_layer_max = self.layer_count
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, use_fast=True, local_files_only=True, _fast_init=True)
            self.accelerator = Accelerator()
            self.model = self.accelerator.prepare(self.model)
            self.register_hooks()
            atexit.register(self.cleanup)

        def register_hooks(self):
            self.model.lm_head.register_forward_hook(self.forward_hook)
            for i, layer in enumerate(self.model.model.layers):
                layer.mlp.down_proj.register_forward_hook(self.down_hook_function)

        def forward_hook(self, module, input, output):
            generated_tokens = torch.argmax(output, dim=-1)
            generated_text = self.tokenizer.decode(generated_tokens[0][-1])
            self.entire_generated_text.append(generated_text)

        def down_hook_function(self, module, input, output):
            if self.current_layer_index == self.layer_count:
                self.current_token_index += 1
                self.current_layer_index = 0
            if self.mode == "chat":
                self.down_outputs.append([self.current_message_index, self.current_token_index, self.current_layer_index] + output.to(dtype=torch.float32)[:, -1, :].detach()[0].cpu().tolist())
            elif self.mode == "collect":
                if self.current_layer_index + 1 >= self.collect_layer_min and self.current_layer_index + 1 <= self.collect_layer_max:
                    self.down_outputs.append([self.current_seed, self.current_token_index, self.current_layer_index] + output.to(dtype=torch.float32)[:, -1, :].detach()[0].cpu().tolist())
            self.current_layer_index += 1
            
        def generate(self, input_ids, max_length, result_container, should_generate_title):
            with LLM._model_lock:
                self.down_outputs = []
                if should_generate_title:
                    with torch.no_grad():
                        result = self.model.generate(**input_ids, max_length=max_length, return_dict_in_generate=True, output_scores=True, use_cache=True)
                    self.past_key_values = result['past_key_values']
                    result_container["result"] = result['sequences']
                    result_container["done"] = True
                else:
                    with torch.no_grad():
                        result = self.model.generate(**input_ids, max_length=max_length)
                    result_container["result"] = result
                    result_container["done"] = True

        def get_entire_generated_text(self):
            with LLM._data_lock:
                return self.entire_generated_text.copy()
            
        def set_default_gen_values(self):
            self.down_outputs = []
            self.entire_generated_text = []
            self.current_token_index = 0
            self.current_layer_index = 0
            
        def set_collect_values(self, current_seed, collect_layer_min, collect_layer_max):
            self.mode = "collect"
            self.current_seed = current_seed
            self.collect_layer_min = collect_layer_min
            self.collect_layer_max = collect_layer_max

        def cleanup(self):
            print("Cleaning up model...")
            del self.model
            del self.tokenizer
            del self.accelerator
            gc.collect()
            torch.cuda.empty_cache()

    def __new__(cls):
        with cls._lock:
            if not cls._instance:
                cls._instance = cls.__LLM()
            return cls._instance
