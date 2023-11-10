from flask import Blueprint, jsonify, request

from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig, pipeline
import torch

tokenizer_name = "tiiuae/falcon-7b-instruct"


tokenizer = AutoTokenizer.from_pretrained(tokenizer_name, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True)
model = AutoModelForCausalLM.from_pretrained(
    "rawkintrevo/hf-sme-falcon-7b",
    revision="v0.0.1",
    quantization_config=bnb_config,
    torch_dtype=torch.float16,
    trust_remote_code=True
)


llm_pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    trust_remote_code=True,
)
api_bp = Blueprint('api', __name__)

@api_bp.route('/generate', methods=['GET'])
def generate():
    input_seq= f"""
### Question:
{request.args.get('query')}
### Answer:
"""
    sequences = llm_pipeline(
        input_seq,
        max_length=int(request.args.get('max_len')),
        do_sample=True,
        temperature=float(request.args.get('temperature')),
        top_k=10,
        num_return_sequences=1,
        eos_token_id=tokenizer.eos_token_id,
    )
    return jsonify(resp=sequences[0]['generated_text'])
