from flask import Flask, jsonify, request
from llm import request_code
from flask_cors import CORS
from compile import compile_and_run
from functools import wraps

app = Flask(__name__)

CORS(app)

def require_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def home():
    print("test")
    return "Hello. Home API Endpoint"

@app.route('/api/imgtocode', methods=['POST'])
@require_json
def imgtocode():
    json = request.json
    if 'img_url' not in json and 'img_base64' not in json:
        return jsonify({'error': 'Missing img_url or img_base64'}), 400
    
    img_url = json.get('img_url')
    img_base64 = json.get('img_base64')
    
    if img_url:
        code, language = request_code(img_url=img_url)
    elif img_base64:
        code, language = request_code(img_base64=img_base64)
    else:
        return jsonify({'error': 'Invalid input'}), 400
    
    response = {
        'code': code,
        'language': language,
    }
    return jsonify(response), 201


@app.route('/api/compile', methods=['POST'])
@require_json
def compile():
    code = request.json.get('code')
    language = request.json.get('language')
    
    if not code or not language:
        return jsonify({"error": "Both 'code' and 'language' are required fields."}), 400

    return compile_and_run(code, language)


# Error handlers
@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(405)
def method_not_allowed(_):
    return jsonify({"error": "Method not allowed"}), 405


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)