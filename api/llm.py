import sys
from openai import OpenAI

client = OpenAI()

def request_code(img_url=None, img_base64=None):
    instructions = "Please transcribe the content of this image into code. Return only the name of the coding language used (either c, bash, java, or python), bolded in markdown, and one markdown code box with the extracted code. The markdown code box should be language ambiguious, denoted using only triple backticks. Fix any errors that are likely to be ambigious to a grader."
    if img_url:
        img_request = {"type": "image_url", "image_url": {"url": img_url}}
    elif img_base64:
        img_request = {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": instructions},
                img_request
            ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        max_tokens=1000,
    )

    if response.choices:
        with open('last_response.txt', 'w') as f:
            f.write(str(response.choices[0].message.content))
        code = response.choices[0].message.content.split("```")[1]
        language = response.choices[0].message.content.split("**")[1]
        return code, language
    else:
        print("Error: No response received from the model.")
        sys.exit(1)

# def generate_tests(code, language):
#     instructions = f"Given this following {language} code, add 3 useful test cases "