from flask import Flask, jsonify, request
from llm import request_code

app = Flask(__name__)

@app.route('/')
def home():
    print("test")
    return "Hello. Home API Endpoint"

@app.route('/api/imgtocode', methods=['POST'])
def imgtocode():
    json = request.json
    image_url = json['image_url']
    code = request_code(image_url)
    code, language = request_code(image_url)
    response = {
        'code': code,
        'language': language,
    }
    return jsonify(response), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)