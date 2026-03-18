import os
import glob
import sys
import argparse
import json
import pandas as pd

def process_form_data(input_xlsx, output_json):
    try:
        df = pd.read_excel(input_xlsx)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        sys.exit(1)

    periods = ['1st', '2nd', '3rd', '5th', '6th', '7th']
    period_map = {f"{p}": i for i, p in enumerate(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'], 1)}
    
    # We use a dict to manage deduplication: key = session_id (id-period)
    # We will also track teacher-to-id mapping to ensure highest ID wins
    processed_sessions = {} 
    teacher_highest_id = {} # Key: Teacher Name, Value: Highest ID seen
    other_instructor_map = {}  # Key: normalized other_instructors -> edited value (or None)

    normalized_cols = {c: c.replace('\xa0', ' ') for c in df.columns}

    # First Pass: Determine the highest ID per teacher for the "Highest ID" rule
    for _, row in df.iterrows():
        f_name = str(row.get('Teacher First Name', '')).strip()
        l_name = str(row.get('Teacher Last Name', '')).strip()
        formatted_teacher = f"{f_name[0]}. {l_name}" if f_name and l_name else "Unknown"
        
        try:
            current_id = int(row.get('ID', 0))
        except ValueError:
            current_id = 0

        if formatted_teacher not in teacher_highest_id or current_id > teacher_highest_id[formatted_teacher]:
            teacher_highest_id[formatted_teacher] = current_id

    # Second Pass: Build sessions
    for _, row in df.iterrows():
        f_name = str(row.get('Teacher First Name', '')).strip()
        l_name = str(row.get('Teacher Last Name', '')).strip()
        formatted_teacher = f"{f_name[0]}. {l_name}" if f_name and l_name else "Unknown"
        
        try:
            original_id = int(row.get('ID', 0))
        except ValueError:
            original_id = 0

        # RULE: Skip if this row's teacher is associated with a higher ID elsewhere
        if original_id < teacher_highest_id.get(formatted_teacher, 0):
            continue

        # Find the raw other instructors text (if present) and allow interactive edits.
        other_inst_col = [orig for orig, norm in normalized_cols.items() if "Other Instructor(s)" in norm]
        raw_others = str(row[other_inst_col[0]] if other_inst_col else "").strip()
        # Normalize a key to cache edits across occurrences
        norm_key = raw_others.strip().lower() if raw_others else None

        # Determine if we're running interactively; if not, avoid prompting and keep original
        interactive = sys.stdin.isatty()

        other_instructors = None
        if raw_others and norm_key not in ['n/a', 'none', 'nan', '']:
            if norm_key in other_instructor_map:
                # Use cached edit (may be None)
                other_instructors = other_instructor_map[norm_key]
            else:
                # Prompt the user to edit the other instructors string when possible
                if interactive:
                    prompt = (
                        f"Edit other instructors entry for '{raw_others}' (press Enter to keep, "
                        "type 'none' to clear): "
                    )
                    try:
                        resp = input(prompt)
                    except EOFError:
                        # Non-interactive environment despite isatty; fallback to original
                        resp = ''

                    if resp.strip() == '':
                        edited = raw_others
                    elif resp.strip().lower() in ['none', 'n/a']:
                        edited = None
                    else:
                        edited = resp.strip()
                else:
                    # Non-interactive: keep original
                    edited = raw_others

                other_instructor_map[norm_key] = edited
                other_instructors = edited

        for p in periods:
            sid = f"{original_id}-{p}"
            
            # Check for title existence
            title_col = [orig for orig, norm in normalized_cols.items() 
                         if f"{p} Period" in norm and "Title" in norm]
            
            if not title_col:
                continue
                
            raw_title = row[title_col[0]]
            
            # We filter out 'prep' or 'none', but ensure actual data rows remain
            if pd.isna(raw_title) or str(raw_title).lower().strip() in ['prep', 'n/a', 'none']:
                continue

            loc_col = [orig for orig, norm in normalized_cols.items() if "Location" in norm and p in norm]
            age_col = [orig for orig, norm in normalized_cols.items() if "Age Group" in norm and p in norm]
            cap_col = [orig for orig, norm in normalized_cols.items() if "Students" in norm and p in norm]

            raw_age = str(row[age_col[0]] if age_col else "").lower()
            if "k - 4" in raw_age or "elementary" in raw_age:
                age_cat = "elementary"
            elif "5 - 6" in raw_age or "intermediate" in raw_age:
                age_cat = "intermediate"
            else:
                age_cat = "hs"

            # NULL HANDLING: Using .get() and checking pd.isna ensures field stays as null/None 
            # instead of crashing or skipping the row.
            session_entry = {
                "session_id": sid,
                "teacher": formatted_teacher,
                "other_instructors": other_instructors,
                "period": period_map.get(p, 0),
                "title": " ".join(str(raw_title).split()) if pd.notna(raw_title) else None,
                "location": row[loc_col[0]] if loc_col and pd.notna(row[loc_col[0]]) else None,
                "age_group": age_cat,
                "max_students": row[cap_col[0]] if cap_col and pd.notna(row[cap_col[0]]) else None
            }
            
            # DEDUPLICATION: Only add if session_id is unique
            if sid not in processed_sessions:
                processed_sessions[sid] = session_entry

    # Propagate any edited "other instructors" values across all processed sessions
    for sid, entry in processed_sessions.items():
        oi = entry.get('other_instructors')
        if oi and isinstance(oi, str):
            nk = oi.strip().lower()
            if nk in other_instructor_map:
                entry['other_instructors'] = other_instructor_map[nk]

    final_list = list(processed_sessions.values())

    with open(output_json, 'w') as f:
        json.dump(final_list, f, indent=4, default=str)

    print(f"Successfully processed {len(final_list)} unique sessions into {output_json}")

def find_first_xlsx(directory):
    pattern = os.path.join(directory, '*.xlsx')
    files = sorted(glob.glob(pattern))
    return files[0] if files else None


def main():
    parser = argparse.ArgumentParser(description='Unified Form XLSX to Clean JSON Pipeline')
    parser.add_argument('--input', '-i', help='Path to input XLSX file')
    parser.add_argument('--output', '-o', default='final_sessions.json', help='Output JSON path')
    args = parser.parse_args()

    # Default logic to find the file
    input_path = args.input or 'Day of Service(1-86).xlsx'
    if not os.path.isfile(input_path):
        candidate = find_first_xlsx(os.path.dirname(__file__) or '.')
        if candidate:
            input_path = candidate
        else:
            print(f"Could not find {input_path} or any .xlsx files.")
            sys.exit(2)

    process_form_data(input_path, args.output)


if __name__ == '__main__':
    main()