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
    system_instruction = """
    You are an assistant tasked with transcribing code from images into a specific JSON format for educational purposes. Adhere strictly to the formatting guidelines:
    1. Identify the programming language (either C, Bash, Java, or Python).
    2. Extract the code and transcribe it accurately, fixing any transcription errors that could reasonably be misinterpreted when converting.
    3. Describe the programming concept of the code in 3-8 words.
    4. Summarize the functionality of the code in 1-5 words.

    Return the output in the following JSON format:
    {
        "language": "<language name>",
        "code": "<code as a single string>",
        "concept": "<short description of the programming concept>",
        "summary": "<short functionality summary>"
    }
    """

    # Define user input (image description or relevant information)
    user_prompt = """
    Please transcribe the content of this image into code.
    Return the output in this specific JSON format in plaintext, with no markdown formatting (no triple backticks):
    {
        "language": "<language name>",
        "code": "<code as a single string>",
        "concept": "<short description of the programming concept>",
        "summary": "<short functionality summary>"
    }
    Fix any errors that could cause ambiguity or misinterpretation.
    """

    messages = [
        {
            "role": "system",
            "content": system_instruction
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": user_prompt},
                img_request
            ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1000,
        temperature=0.1,
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
    # instructions = f"Given this following {language} code, add 3 useful test cases to the code. These test cases will run from the outermost scope of the script, and call the function in question. If the provided code is not a function, create a function that will be called by the test cases. Return the entire code block in a markdown code block, denoted using triple backtick, without the language. Do not return anything else. Code: ```{code}```"

    system_instruction = f"""
    You are an expert assistant for generating test cases for code. 
    Your task is to ensure that the code is runnable, tested, and outputs meaningful results.
    Follow these rules:
    1. Identify whether the provided code already includes a callable function.
       - If it doesn't, encapsulate the logic into a function.
    2. Add three meaningful test cases:
       - One with typical inputs.
       - One testing an edge case (e.g., smallest/largest valid input).
       - One with invalid/unexpected input (if applicable).
    3. Add necessary imports and entry points for execution:
       - Python: Place test cases under `if __name__ == "__main__":`.
       - C: Add a `main` function that calls the function(s).
       - Java: Add a `main` method to call the function(s).
       - Bash: Add inline, executable test cases.
    4. Ensure the output is a complete, runnable code block.
    5. Return the updated code, using triple backticks to denote the code block without specifying the language.
    """

    user_instruction = f"""
    Provided Code:
    ```
    {code}
    ```
    Enhance the code with test cases as described above and return the full updated code. 
    Do not include any additional text or explanations.
    """

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
        code = response.choices[0].message.content.split("```")[1]
        return code, language
    else:
        print("Error: No response received from the model.")
        sys.exit(1)