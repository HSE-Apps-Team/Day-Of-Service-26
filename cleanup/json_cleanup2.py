import json
import os

def transform_activities(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, 'r') as f:
        data = json.load(f)

    transformed_data = []

    # Mapping for period strings to numbers
    period_map = {
        "1st": 1, "2nd": 2, "3rd": 3, 
        "4th": 4, "5th": 5, "6th": 6, "7th": 7
    }

    for entry in data:
        # 1. Format Teacher Name (F. Last)
        full_name = entry.get("teacher", "")
        formatted_name = "Unknown"
        if full_name:
            parts = full_name.split()
            formatted_name = f"{parts[0][0]}. {parts[-1]}" if len(parts) >= 2 else full_name

        # 2. Convert Period to Number
        period_str = entry.get("period", "NA")
        period_num = period_map.get(period_str, 0) # Defaults to 0 if not found

        # 3. Normalize Age Group
        raw_age = str(entry.get("age_group", "")).lower()
        if "k - 4" in raw_age or "elementary" in raw_age:
            age_category = "elementary"
        elif "5 - 6" in raw_age or "intermediate" in raw_age:
            age_category = "intermediate"
        else:
            age_category = "hs"

        # 4. Unique Session ID
        original_id = entry.get("id", "0")
        unique_id = f"{original_id}-{period_str}"

        new_entry = {
            "session_id": unique_id,
            "teacher": formatted_name,
            "period": period_num,
            "title": entry.get("title"),
            "location": entry.get("location"),
            "age_group": age_category,
            "max_students": entry.get("max_students")
        }
        
        transformed_data.append(new_entry)

    with open(output_file, 'w') as f:
        json.dump(transformed_data, f, indent=4)

    print(f"Successfully transformed {len(transformed_data)} sessions.")

# Execution
transform_activities('cleanup/final_activities.json', 'cleanup/final_sessions.json')