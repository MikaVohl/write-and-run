import sys
from openai import OpenAI

client = OpenAI()

def request_code(img_url=None, img_base64=None):
    # instructions = "Please transcribe the content of this image into code. Return only the name of the coding language used (either c, bash, java, or python), bolded in markdown, one markdown code box with the extracted code, and a short (3-8 word) sentence describing the programming concept of the program (ex. 'Socket Programming in C'). The markdown code box should be language ambiguious, denoted using only triple backticks. Fix any errors that are likely to be ambigious to a grader."
    if img_url:
        img_request = {"type": "image_url", "image_url": {"url": img_url}}
    elif img_base64:
        img_request = {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
    
    # Define the structured prompt with instructions
    system_instruction = """
    You are an assistant tasked with transcribing code from images into a specific format for educational purposes. Adhere strictly to the formatting guidelines:
    1. Identify the programming language (either C, Bash, Java, or Python).
    2. Bold the programming language name in markdown (e.g., **Python**).
    3. Provide the extracted code in a language-agnostic markdown code block (denoted using triple backticks without a language specifier).
    4. Add a short description (3-8 words) describing the programming concept of the code (e.g., "Socket Programming in C").
    5. Do not use language-specific annotations (e.g., `python` in code block headers). The markdown code block must remain language-agnostic.
    6. Fix any transcription errors that could reasonably be misinterpreted when converting.
    """

    # Define user input (image description or relevant information)
    user_prompt = """
    Please transcribe the content of this image into code. 
    Return only the following:
    1. The name of the coding language used (either C, Bash, Java, or Python), bolded in markdown.
    2. A markdown code block containing the extracted code. Use triple backticks **without any language specifier**.
    3. A short sentence (1-5 words) describing the programming concept (e.g., "Socket Programming", "Memory Manipulation", "Recursion").
    Ensure the output adheres to this format:
    **Language Name**
    ```<Code here>```<Short description of the coding concept used>
    Fix any errors that are ambiguous to a grader. """

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
        with open('last_response.txt', 'w') as f:
            f.write(str(response.choices[0].message.content))
        content = response.choices[0].message.content
        code = content.split("```")[1].strip()
        language = content.split("**")[1].strip()
        concept = content.split("```")[2].strip()
        return code, language, concept
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