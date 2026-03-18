import os
import glob
import sys
import argparse
import json
import pandas as pd


def convert_to_clean_json(input_xlsx, output_json):
    try:
        df = pd.read_excel(input_xlsx)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        sys.exit(1)

    # Periods to extract (skipping 4th as per your form structure)
    periods = ['1st', '2nd', '3rd', '5th', '6th', '7th']
    
    clean_data = []
    
    # Normalize column names for matching (replace NBSP with normal space)
    normalized_cols = {c: c.replace('\xa0', ' ') for c in df.columns}

    for _, row in df.iterrows():
        # Common data for all sessions by this teacher
        teacher_info = {
            'id': row['ID'] if 'ID' in df.columns else None,
            'email': row['Email'] if 'Email' in df.columns else None,
            'name': row['Name'] if 'Name' in df.columns else None,
            'teacher_last_name': row.get('Teacher Last Name', '').strip(),
            'teacher_first_name': row.get('Teacher First Name', '').strip(),
        }

        for p in periods:
            # Dynamically find columns for this specific period
            # We look for the Title/Description column first to see if a session exists
            title_col = [orig for orig, norm in normalized_cols.items() 
                         if f"{p} Period" in norm and "Title" in norm]
            
            if not title_col:
                continue
                
            session_title = row[title_col[0]]
            
            # Skip if the period is empty or marked as "Prep"
            if pd.isna(session_title) or str(session_title).lower().strip() in ['prep', 'n/a', 'none']:
                continue

            # Extract location, age group, and capacity for this specific period
            loc_col = [orig for orig, norm in normalized_cols.items() if f"Location" in norm and f"{p}" in norm]
            age_col = [orig for orig, norm in normalized_cols.items() if f"Age Group" in norm and f"{p}" in norm]
            cap_col = [orig for orig, norm in normalized_cols.items() if f"Students" in norm and f"{p}" in norm]

            session_entry = teacher_info.copy()
            session_entry.update({
                'period': p,
                'title': session_title.strip(),
                'location': row[loc_col[0]] if loc_col and pd.notna(row[loc_col[0]]) else None,
                'age_group': row[age_col[0]] if age_col and pd.notna(row[age_col[0]]) else None,
                'max_students': row[cap_col[0]] if cap_col and pd.notna(row[cap_col[0]]) else None
            })
            
            clean_data.append(session_entry)

    with open(output_json, 'w') as f:
        json.dump(clean_data, f, indent=4, default=str)

    print(f"Successfully processed {len(clean_data)} individual activities into {output_json}")


def find_first_xlsx_in_dir(directory):
    pattern = os.path.join(directory, '*.xlsx')
    files = sorted(glob.glob(pattern))
    return files[0] if files else None


def main():
    parser = argparse.ArgumentParser(description='Convert form XLSX to cleaned JSON')
    parser.add_argument('--input', '-i', help='Path to input XLSX file')
    parser.add_argument('--output', '-o', default='cleaned_responses.json', help='Output JSON path')
    args = parser.parse_args()

    repo_cleanup_dir = os.path.dirname(__file__)

    input_path = args.input or 'Day of Service(1-86).xlsx'

    # If provided path doesn't exist, try to find a first XLSX in the cleanup dir
    if not os.path.isfile(input_path):
        candidate = find_first_xlsx_in_dir(repo_cleanup_dir)
        if candidate:
            print(f"Input '{input_path}' not found — using first XLSX in {repo_cleanup_dir}: {candidate}")
            input_path = candidate
        else:
            print(f"Input '{input_path}' not found and no .xlsx files in {repo_cleanup_dir}.")
            sys.exit(2)

    try:
        convert_to_clean_json(input_path, args.output)
    except FileNotFoundError:
        print(f"File not found: {input_path}")
        sys.exit(1)


if __name__ == '__main__':
    main()