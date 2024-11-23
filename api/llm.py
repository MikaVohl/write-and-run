import sys
from openai import OpenAI

client = OpenAI()

def request_code(image_url):
    instructions = "Please transcribe the content of this image into code. Return only the name of the coding language used, bolded in markdown, and one markdown code box with the extracted code. The markdown code box should be language ambiguious, denoted using only triple backticks."

    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": instructions},
                {"type": "image_url", "image_url": { "url":  image_url }}
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