import subprocess
import os
import shutil
import secrets
import tempfile
import importlib
import subprocess
import sys
import requests


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

        if "ModuleNotFoundError" in process.stderr:
            if not check_and_install(process.stderr.split("'")[1]):
                return {
                    "success": False,
                    "error": "ModuleNotFoundError: Something wrong when installing the module"
                }, 200
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

