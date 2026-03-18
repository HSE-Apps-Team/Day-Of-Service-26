import json

def cleanup_json_data(input_file, output_file):
    # Load your current JSON sample
    with open(input_file, 'r') as f:
        data = json.load(f)

    cleaned_list = []

    for entry in data:
        # Create a new dictionary with only the necessary fields
        clean_entry = {
            "id": entry.get("id"),
            "teacher": f"{entry.get('teacher_first_name', '')} {entry.get('teacher_last_name', '')}".strip(),
            "period": entry.get("period"),
            "title": entry.get("title"),
            "location": entry.get("location"),
            "age_group": entry.get("age_group"),
            "max_students": entry.get("max_students")
        }
        
        # Clean up the 'title' if it's too long or has extra whitespace
        if clean_entry["title"]:
            clean_entry["title"] = " ".join(clean_entry["title"].split())

        cleaned_list.append(clean_entry)

    # Save the strictly relevant data
    with open(output_file, 'w') as f:
        json.dump(cleaned_list, f, indent=4)

    print(f"Cleaned {len(cleaned_list)} entries.")

# Usage
cleanup_json_data('cleanup/cleaned_responses.json', 'cleanup/final_activities.json')