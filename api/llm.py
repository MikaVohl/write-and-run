import sys
from openai import OpenAI
import json

client = OpenAI()

def request_code(img_url=None, img_base64=None):
    # instructions = "Please transcribe the content of this image into code. Return only the name of the coding language used (either c, bash, java, or python), bolded in markdown, one markdown code box with the extracted code, and a short (3-8 word) sentence describing the programming concept of the program (ex. 'Socket Programming in C'). The markdown code box should be language ambiguious, denoted using only triple backticks. Fix any errors that are likely to be ambigious to a grader."
    if img_url:
        img_request = {"type": "image_url", "image_url": {"url": img_url}}
    elif img_base64:
        img_request = {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
    
    # Define the structured prompt with instructions

    # TODO: What should be done if there is no code detected? No language detected?
    # TODO: Try to speed up responses. Maybe reduce max_tokens? Change the model?
    system_instruction = """
    You are an assistant tasked with transcribing handwritten code from images into a specific JSON format for compilation and execution. You will attempt to generate an output that stays as true to the input image as possible. Adhere strictly to the formatting guidelines:
    1. Identify the programming language (either C, Bash, Java, or Python).
    2. Extract the code and transcribe it accurately, fixing any errors that most likely arose from the conversion from image to text or that are inherent to the ambiguity of handwriting (e.g. indentation, spacing, capitalization). Do not fixing syntax/logic errors that are too major to be a misinterpretation of the handwriting.
    3. Based on the programming language, fix any errors that are likely to be ambiguous to a grader.
    4. Describe the primary programming concept used in the code in 1-4 words (e.g., 'Recursion', 'Socket Programming', 'Data Manipulation', 'Memory Management', 'Sorting Algorithms', etc.).
    5. Summarize the objective of the code in 1-5 words (e.g. 'Defining dynamic array', 'Merge sort implementation', 'Compute fibonacci number', etc.).

    Return the output in this specific JSON format in plaintext, with no triple backticks, include spaces, tabs, and newlines as needed:
    {
        "language": "<language name>",
        "code": "<code as a single string>",
        "concept": "<short description of the programming concept>",
        "summary": "<short functionality summary>"
    }
    """

    messages = [
        {
            "role": "system",
            "content": system_instruction
        },
        {
            "role": "user",
            "content": [ img_request ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1000,
        temperature=1,
    )

    if response.choices:
        content = response.choices[0].message.content
        print(content)
        # Parse the JSON content
        try:
            data = json.loads(content)

            # Extract required fields with default values if keys are missing
            language = data.get("language", "Unknown")
            code = data.get("code", "")
            concept = data.get("concept", "")
            summary = data.get("summary", "")

            # Optionally, you can perform additional validation here
            if not language or not code:
                raise ValueError("Essential fields are missing in the response.")

            # Return the extracted values
            return code, language, concept, summary
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON content: {e}")
        except ValueError as e:
            print(f"Error parsing JSON content: {e}")

    else:
        print("Error: No response received from the model.")
        sys.exit(1)

def generate_tests(code, language):
    # TODO: Include expected output in the test cases
    system_instruction = f"""
    You are an expert assistant for generating test cases for given input {language} code.
    Your task is to ensure that the code is runnable, tested, and outputs meaningful results.
    Only generate tests where it makes sense to do so, functions that have no parameters or no recognizable strucure shouldn't have tests.
    Return only the output in this specific JSON format in plaintext, with no triple backticks, include spaces, tabs, and newlines as needed:
    {{
        "code": "<updated source code>", # Empty string if no tests were created
        "reason": "<reason for rejection>", # Empty string if tests were created
    }}
    Follow these rules:
    1. Identify whether it makes sense to test the provided code.
       - If not, immediately return a 'code' field with an empty string and a 'reason' field explaining why tests were not created.
    2. Identify whether the provided code already includes a callable function.
       - If it doesn't, encapsulate the logic into a function.
    3. Add a few meaningful test cases, without providing the expected output, adding very concise comments to each case:
       - Only test cases that are relevant to the code's functionality.
       - Test cases should reveal meaningful insights about the code's behavior.
       - Mostly test intended functionality, but also consider reasonable edge cases.
    4. Add necessary imports and entry points for execution:
       - Python: Place test cases under `if __name__ == "__main__":`.
       - C: Add a `main` function that calls the function(s).
       - Java: Add a `main` method to call the function(s).
       - Bash: Add inline, executable test cases.
    5. Ensure the output is a complete, runnable code block.
    6. Return the JSON as specified above.
    """

    user_instruction = code

    messages = [
        {
            "role": "system",
            "content": system_instruction
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": user_instruction},
            ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1000,
    )

    if response.choices:
        print(response.choices[0].message.content)

        parsed_data = json.loads(response.choices[0].message.content)

        output_code = parsed_data['code']
        reason = parsed_data['reason']

        return output_code, language, reason
    else:
        print("Error: No response received from the model.")
        sys.exit(1)