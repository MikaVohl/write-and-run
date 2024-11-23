import subprocess
import os
import shutil
import secrets
import tempfile
import importlib
import subprocess
import sys
import requests
from contextlib import contextmanager


ALLOWED_LANGUAGES = {
    'python': {
        'file_extension': '.py',
        'command': ['python3'],
        'compile_command': None,
        'timeout': 5  # seconds
    },
    'bash': {
        'file_extension': '.sh',
        'command': ['bash'],
        'compile_command': None,
        'timeout': 5
    },
    'c': {
        'file_extension': '.c',
        'command': ['./a.out'],
        'compile_command': ['gcc'],
        'timeout': 5
    },
    'java': {
        'file_extension': '.java',
        'command': ['java'],
        'compile_command': ['javac'],
        'timeout': 5
    }
}

MAX_CODE_LENGTH = 50000  # characters
TEMP_DIR = tempfile.mkdtemp(prefix='secure_compiler_')

def sanitize_output(output: str, max_length: int = 10000) -> str:
    """Sanitize and truncate command output."""
    if output is None:
        return ""
    return output[:max_length]

def compile_code(file_path: str, lang_config: dict, run_dir: str) -> tuple:
    """Compile the source code if needed."""
    if not lang_config.get('compile_command'):
        return True, ""
    
    try:
        if lang_config['compile_command'][0] == 'gcc':
            process = subprocess.run(
                lang_config['compile_command'] + [file_path],
                capture_output=True,
                text=True,
                cwd=run_dir
            )
        elif lang_config['compile_command'][0] == 'javac':
            process = subprocess.run(
                lang_config['compile_command'] + [file_path],
                capture_output=True,
                text=True,
                cwd=run_dir
            )
        
        if process.returncode != 0:
            return False, process.stderr
        
        return True, ""
    except Exception as e:
        return False, str(e)

def get_run_command(language: str, file_path: str, run_dir: str) -> list:
    """Get the appropriate run command based on language."""
    if language == 'java':
        # Extract class name from file path and remove .java extension
        class_name = os.path.basename(file_path)[:-5]
        return ['java', class_name]
    elif language == 'python':
        return ALLOWED_LANGUAGES[language]['command'] + [file_path]
    return ALLOWED_LANGUAGES[language]['command']

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
            return {"error": f"Language '{language}' not supported."}, 400
        
        file_extension = lang_config['file_extension']
        timeout = lang_config['timeout']
        
        # Create the source code file
        file_path = os.path.join(run_dir, f'source{file_extension}')
        with open(file_path, 'w') as f:
            f.write(code)
        
        # Set execute permission for bash scripts
        if language == 'bash':
            os.chmod(file_path, 0o755)
        
        # Compile if necessary
        if lang_config.get('compile_command'):
            success, compile_error = compile_code(file_path, lang_config, run_dir)
            if not success:
                return {
                    "success": False,
                    "error": f"Compilation error: {compile_error}"
                }, 200
        
        # Get the appropriate run command
        run_command = get_run_command(language, file_path, run_dir)
        
        # Special handling for Python
        if language == 'python':
            try:
                process = subprocess.run(
                    run_command,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    cwd=run_dir
                )
                
                # Handle Python module installation if needed
                if "ModuleNotFoundError" in process.stderr:
                    if not check_and_install(process.stderr.split("'")[1]):
                        return {
                            "success": False,
                            "error": "ModuleNotFoundError: Something wrong when installing the module"
                        }, 200
                    
                    process = subprocess.run(
                        run_command,
                        capture_output=True,
                        text=True,
                        timeout=timeout,
                        cwd=run_dir
                    )
                
                return {
                    "success": True,
                    "stdout": sanitize_output(process.stdout),
                    "stderr": sanitize_output(process.stderr),
                    "returncode": process.returncode
                }, 200
                
            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "error": f"Execution timed out after {timeout} seconds"
                }, 200
        
        # Handle other languages
        else:
            try:
                process = subprocess.run(
                    run_command,
                    capture_output=True,
                    text=True,
                    timeout=timeout,
                    cwd=run_dir
                )
                
                return {
                    "success": True,
                    "stdout": sanitize_output(process.stdout),
                    "stderr": sanitize_output(process.stderr),
                    "returncode": process.returncode
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

def check_and_install(package_name):
    """
    Check if a package is installed. If not, check its size on PyPI and install it if under 5MB.
    """
    try:
        # Check if the package is already installed
        importlib.import_module(package_name)
        print(f"'{package_name}' is already installed.")
        return False
    except ImportError:
        print(f"'{package_name}' is not installed. Checking size...")


    # Check package size from PyPI
    try:
        response = requests.get(f"https://pypi.org/pypi/{package_name}/json", timeout=10)
        response.raise_for_status()
        data = response.json()
        # Get size of the latest release's wheel file
        urls = data["releases"][data["info"]["version"]]
        total_size = sum(file["size"] for file in urls if file["packagetype"] == "bdist_wheel")

        size_in_mb = total_size / (1024 * 1024)
        if size_in_mb > 1000:
            print(f"'{package_name}' is too large ({size_in_mb:.2f} MB). Not installing.")
            return
        print(f"'{package_name}' is {size_in_mb:.2f} MB. Proceeding with installation...")

        # Install the package
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        print(f"'{package_name}' installed successfully.")
        return True
    except Exception as e:
        print(f"Error checking or installing '{package_name}': {e}")
        return False

