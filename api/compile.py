import subprocess
import os
import shutil
import secrets
import tempfile


ALLOWED_LANGUAGES = {
    'python': {
        'file_extension': '.py',
        'command': ['python3'],
        'timeout': 5  # seconds
    },
}

MAX_CODE_LENGTH = 50000  # characters
TEMP_DIR = tempfile.mkdtemp(prefix='secure_compiler_')

def sanitize_output(output: str, max_length: int = 10000) -> str:
    """Sanitize and truncate command output."""
    if output is None:
        return ""
    return output[:max_length]

def compile_and_run(code, language):
    """
    Securely compile and run code in a temporary directory.
    Returns a dictionary with compilation/execution results.
    """
    run_dir = os.path.join(TEMP_DIR, secrets.token_hex(16))
    os.makedirs(run_dir, exist_ok=True)

    try:
        # Get the configuration for the specified language
        lang_config = ALLOWED_LANGUAGES.get(language)
        if not lang_config:
            {"error": f"Language '{language}' not supported."}, 400

        file_extension = lang_config['file_extension']
        timeout = lang_config['timeout']
        
        # Create the source code file
        file_path = os.path.join(run_dir, f'source{file_extension}')
        with open(file_path, 'w') as f:
            f.write(code)
        
        # Handle commands based on the language
        if language == 'python':
            process = subprocess.run(
                lang_config['command'] + [file_path],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=run_dir
            )
        
        output = process.stdout
        error_output = process.stderr
        return_code = process.returncode

        return {
            "success": True,
            "stdout": sanitize_output(output),
            "stderr": sanitize_output(error_output),
            "returncode": return_code
        }, 200
    
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": f"Execution timed out after {timeout} seconds"
        }, 200
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }, 200
    finally:
        shutil.rmtree(run_dir, ignore_errors=True)