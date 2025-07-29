import json
from openai import OpenAI 


def imgfile_tblsextrt(img_path, output_json_path, user_prompt, model_used):
    client = OpenAI()

    # Function to create a file with the Files API
    def create_file(file_path):
        with open(file_path, "rb") as file_content:
            result = client.files.create(
                file=file_content,
                purpose="vision",
            )
            return result.id

    # Path to your image
    file_id = create_file(img_path)

    response = client.responses.create(
        model=model_used,
        input=[
            {
                "role": "user",
                "content": [
                    { "type": "input_text", "text": user_prompt },
                    {
                        "type": "input_image",
                        "file_id": file_id,
                    },
                ],
            }
        ],
        text={
                "format": {
                    "type": "json_schema",
                    "name": "tbls_resp",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title":       { "type": "string" },
                            "description": { "type": "string" },
                            "columns": {
                                "type": "array",
                                "items": { "type": "string" },
                                "minItems": 1
                            },
                            "rows": {
                                "type": "array",
                                "items": {
                                    "type": "array",
                                    "items": { "type": "string" }
                                },
                            "minItems": 1
                            },
                        },
                    "required": ["title", "description","columns", "rows"],
                    "additionalProperties": False,
                    },
                    "strict": True,
                },
            },

    )

    response_text = response.output_text
    resp_usage= response.usage.total_tokens
    response_dict = json.loads(response_text)
    '''
    with open(output_json_path, "w", encoding="utf-8") as out_f:
        json.dump(response_dict, out_f, indent=4)

    print(f"Saved JSON output to {output_json_path}")
    '''
    return [response_dict, resp_usage]