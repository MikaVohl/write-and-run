from flask import Flask, jsonify, request
from llm import request_code, generate_tests
from flask_cors import CORS
from compile import compile_and_run
from functools import wraps
import os

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "https://write-and-run.vercel.app",
            "http://localhost:3000"  
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

def require_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/imgtocode', methods=['POST'])
@require_json
def imgtocode():
    json = request.json
    if 'img_url' not in json and 'img_base64' not in json:
        return jsonify({'error': 'Missing img_url or img_base64'}), 400
    
    img_url = json.get('img_url')
    img_base64 = json.get('img_base64')
    
    try:
        if img_url:
            code, language, concept, summary, analysis = request_code(img_url=img_url)
        elif img_base64:
            code, language, concept, summary, analysis = request_code(img_base64=img_base64)
        else:
            return jsonify({'error': 'Invalid input'}), 400
    except:
        response = {
            'code': '',
            'language': 'python',
            'concept': '',
            'summary': '',
            'analysis': '',
        }
        return jsonify(response), 201
    
    response = {
        'code': code,
        'language': language,
        'concept': concept,
        'summary': summary,
        'analysis': analysis,
    }
    print(response)
    return jsonify(response), 201

@app.route('/api/generatetests', methods=['POST'])
@require_json
def tests():
    print("test")
    code = request.json.get('code')
    language = request.json.get('language')
    print(code)
    print(language)
    
    if not code or not language:
        return jsonify({"error": "Both 'code' and 'language' are required fields."}), 400

    code_out, language, reason, status = generate_tests(code, language)
    response = {
        'code': code_out,
        'language': language,
        'reason': reason,
        'status': status
    }
    print(response)
    return jsonify(response), 201


@app.route('/api/compile', methods=['POST'])
@require_json
def compile():
    code = request.json.get('code')
    language = request.json.get('language')
    
    if not code or not language:
        return jsonify({"error": "Both 'code' and 'language' are required fields."}), 400

    output = compile_and_run(code, language)
    return jsonify(output[0]), output[1]


# Error handlers
@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(405)
def method_not_allowed(_):
    return jsonify({"error": "Method not allowed"}), 405


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)