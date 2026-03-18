import json
try:
    import ollama
    OLLAMA_AVAILABLE = True
except Exception as _e:
    print(f"Warning: failed to import ollama in test_ai.py: {_e}")
    OLLAMA_AVAILABLE = False

def normalize_with_slm(messy_json_list):
    # This prompt tells the model exactly how to behave
    system_prompt = """
    You are a JSON repair tool. You will receive a list of school activity sessions.
    Your job is to return a valid JSON array where every object follows these rules:
    1. 'teacher': Must be 'FirstInitial. LastName' (e.g., 'K. Webber').
    2. 'other_instructors': If it contains 'I think' or uncertainty, strip it. Format as a clean list or null.
    3. 'title': If it says 'Same as above', replace it with the title from the previous period for that teacher.
    4. 'max_students': Convert to a single integer (use the higher number in a range).
    5. 'location': If 'TBD', keep as 'TBD'.
    Return ONLY the JSON array. No conversational text.
    """

    # We pass the data to the local model
    if not OLLAMA_AVAILABLE:
        print("[test_ai] ollama not available — returning empty string")
        return ''

    print(f"[test_ai] Sending {len(messy_json_list)} items to SLM (preview): {json.dumps(messy_json_list)[:200]}")
    try:
        response = ollama.chat(model='phi3', messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': json.dumps(messy_json_list)}
        ])
        content = response.get('message', {}).get('content', '')
        print(f"[test_ai] Received SLM response (preview): {content[:300]}")
        return content
    except Exception as e:
        print(f"[test_ai] Error calling ollama.chat: {e}")
        return ''

# Example Usage
messy_data = [
    {
        "session_id": "80-3rd",
        "teacher": "K. Webber",
        "other_instructors": "Dr. Regelski (I think)",
        "title": "Mini Ping Pong",
        "max_students": "15-20"
    },
    {
        "session_id": "81-7th",
        "teacher": "J. McGrath",
        "other_instructors": "Danielle Taylor for some periods and Jessica Morris/Jen Torres for others and individual.",
        "period": 7,
        "title": "Paws & Wags: The English Lab Experience - Come meet Chief, Hank, Peggy, and Rocky\u2014four incredibly friendly English Labs with calm demeanors and loving personalities! These sweet pups are gentle, affectionate, and always ready to make new friends. Whether you\u2019re a lifelong dog lover or just need a little puppy happiness in your day, you won\u2019t want to miss meeting this lovable crew! \ud83d\udc3e",
        "location": "TBD",
        "age_group": "hs",
        "max_students": "30"
    },
]

# Note: In a real script, you'd send 5-10 entries at a time to stay within context limits.
cleaned_json_string = normalize_with_slm(messy_data)
print(cleaned_json_string)