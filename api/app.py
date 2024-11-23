from flask import Flask, jsonify, request
from llm import request_code
import subprocess
import tempfile
import os

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
ALLOWED_LANGUAGES = {
    'python': {
        'file_extension': '.py',
        'command': ['python'],
        'timeout': 5  # seconds
    },
    'java': {
        'file_extension': '.java',
        'command': ['javac', 'java'],  # Compiling and running
        'timeout': 10
    },
    'bash': {
        'file_extension': '.sh',
        'command': ['bash'],
        'timeout': 5
    },
    'javascript': {
        'file_extension': '.js',
        'command': ['node'],  # Using Node.js to run JavaScript
        'timeout': 5
    },
    'c': {
        'file_extension': '.c',
        'command': ['gcc', '-o', 'program', '&&', './program'],  # Compile and execute
        'timeout': 10
    }
}


MAX_CODE_LENGTH = 50000  # characters
TEMP_DIR = tempfile.mkdtemp(prefix='secure_compiler_')

def require_json(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 415
        return f(*args, **kwargs)
    return decorated_function

def sanitize_output(output: str, max_length: int = 10000) -> str:
    """Sanitize and truncate command output."""
    if output is None:
        return ""
    return output[:max_length]

@app.route('/api/compile', methods=['POST'])
@require_json
def compile_and_run():
    """
    Securely compile and run code in a temporary directory.
    Returns a dictionary with compilation/execution results.
    """
    code = request.json.get('code')  # Extract the code from the request
    language = request.json.get('language')  # Extract the language from the request
    
    if not code or not language:
        return jsonify({"error": "Both 'code' and 'language' are required fields."}), 400
    
    run_dir = os.path.join(TEMP_DIR, secrets.token_hex(16))
    os.makedirs(run_dir, exist_ok=True)

    try:
        # Get the configuration for the specified language
        lang_config = ALLOWED_LANGUAGES.get(language)
        if not lang_config:
            return jsonify({"error": f"Language '{language}' not supported."}), 400

        file_extension = lang_config['file_extension']
        timeout = lang_config['timeout']
        
        # Create the source code file
        file_path = os.path.join(run_dir, f'source{file_extension}')
        with open(file_path, 'w') as f:
            f.write(code)
        
        # Handle commands based on the language
        output = ""
        
        if language == 'c':
            # Compile C code
            compile_process = subprocess.run(
                lang_config['compile_command'] + [file_path], 
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=run_dir
            )
            if compile_process.returncode != 0:
                return {
                    "success": False,
                    "stdout": sanitize_output(compile_process.stdout),
                    "stderr": sanitize_output(compile_process.stderr),
                    "returncode": compile_process.returncode
                }
            # Run the compiled C program
            run_process = subprocess.run(
                lang_config['run_command'],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=run_dir
            )
            if run_process.returncode != 0:
                return {
                    "success": False,
                    "stdout": sanitize_output(run_process.stdout),
                    "stderr": sanitize_output(run_process.stderr),
                    "returncode": run_process.returncode
                }
            output = run_process.stdout

        else:
            # For other languages, use the provided command to run the code
            process = subprocess.run(
                lang_config['command'] + [file_path],  # Add the file path to the command
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=run_dir
            )
            if process.returncode != 0:
                return {
                    "success": False,
                    "stdout": sanitize_output(process.stdout),
                    "stderr": sanitize_output(process.stderr),
                    "returncode": process.returncode
                }
            output = process.stdout

        return {
            "success": True,
            "stdout": sanitize_output(output),
            "stderr": "",
            "returncode": 0
        }
    
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": f"Execution timed out after {timeout} seconds"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        shutil.rmtree(run_dir, ignore_errors=True)


# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405

if __name__ == '__main__':
    # Ensure temp directory exists
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    # Run with security measures
    app.run(host='127.0.0.1', port=5000)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)