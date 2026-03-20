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

    # Load teacher -> department mapping from local Teachers workbook (if present)
    teacher_dept_map = {}
    try:
        teachers_path = os.path.join(os.path.dirname(__file__), 'Teachers w department.xlsx')
        if os.path.isfile(teachers_path):
            tdf = pd.read_excel(teachers_path)
            for _, trow in tdf.iterrows():
                # support common column names
                tf = str(trow.get('Fname', trow.get('F', trow.get('First', trow.get('Fname', ''))))).strip()
                tl = str(trow.get('Lname', trow.get('L', trow.get('Last', trow.get('Lname', ''))))).strip()
                dept = trow.get('Dept', trow.get('Department'))
                if pd.isna(dept):
                    dept = None

                if tf and tl:
                    key = f"{tf[0]}. {tl}"
                    teacher_dept_map[key] = dept
                    # also store alternate key by tuple (last.lower(), first_initial)
                    teacher_dept_map[(tl.lower(), tf[0].lower())] = dept
    except Exception as e:
        print(f"Warning: Could not load teachers file for department mapping: {e}")

    periods = ['1st', '2nd', '3rd', '5th', '6th', '7th']
    period_map = {f"{p}": i for i, p in enumerate(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'], 1)}
    
    # We use a dict to manage deduplication: key = session_id (id-period)
    # We will also track teacher-to-id mapping to ensure highest ID wins
    processed_sessions = {} 
    teacher_highest_id = {} # Key: Teacher Name, Value: Highest ID seen
    other_instructor_map = {}  # Key: normalized other_instructors -> edited value (or None)
    title_edit_map = {}  # Key: normalized raw_title -> (title, description)

    normalized_cols = {c: c.replace('\xa0', ' ') for c in df.columns}

    def guess_other_instructors(raw_text: str) -> str:
        """Make a simple guess for other instructors formatting.
        Heuristic: split on commas/ampersand/and, then convert each name to
        an initial + last form when possible (e.g. "Erica Kelly" -> "E. Kelly").
        Preserve titles like 'Dr.' and entries that look like initials already.
        """
        if not raw_text:
            return ''

        parts = []
        # split common separators
        for part in [p.strip() for p in __import__('re').split(r",|&|\\band\\b|/", raw_text) if p.strip()]:
            # remove extraneous parentheticals
            p = __import__('re').sub(r"\(.*?\)", "", part).strip()
            if not p:
                continue
            tokens = p.split()
            # preserve honorifics like Dr., Mrs., Mr.
            if tokens[0].lower().rstrip('.') in ('dr', 'mr', 'mrs', 'ms'):
                # keep as-is but normalize spacing
                parts.append(" ".join(tokens))
                continue

            if len(tokens) == 1:
                # single token, maybe a last name or one-word name; keep as-is
                parts.append(tokens[0])
                continue

            # multiple tokens: prefer initial + last
            first = tokens[0]
            last = tokens[-1]
            # if first already looks like an initial (e.g. 'E.'), keep it
            if len(first) == 2 and first.endswith('.'):
                shortened = f"{first} {last}"
            else:
                shortened = f"{first[0]}. {last}"
            parts.append(shortened)

        return ", ".join(parts)

    def guess_title_description(raw_text: str):
        """Guess a split of title and description from a single title field.
        Returns (title_guess, description_guess_or_None).
        Heuristics:
        - If contains '-' or '–' or ':' or ';' split at first occurrence.
        - Else if many words (>6) split after first 3 words.
        - Else assume no description.
        """
        if not raw_text:
            return (None, None)

        s = str(raw_text).strip()
        if not s:
            return (None, None)

        for sep in [' - ', '–', ':', ';']:
            if sep in s:
                left, right = s.split(sep, 1)
                left = left.strip()
                right = right.strip()
                if right:
                    return (left, right)
                else:
                    return (s, None)

        words = s.split()
        if len(words) > 6:
            title_guess = " ".join(words[:3])
            desc_guess = " ".join(words[3:])
            return (title_guess, desc_guess)

        return (s, None)

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
                    # build a guess to offer the user
                    guess = guess_other_instructors(raw_others)
                    # Build a clearer multi-line prompt for interactive editing
                    prompt_lines = [f"\nOther instructors: {raw_others}"]
                    if guess and guess.lower().strip() != raw_others.lower().strip():
                        prompt_lines.append(f"Guess: {guess}")
                    prompt_lines.append("Options: [Enter=keep] [n=clear] [c=accept guess] [type replacement]")
                    prompt_lines.append("Choice: ")
                    prompt = "\n".join(prompt_lines)
                    try:
                        resp = input(prompt)
                    except EOFError:
                        # Non-interactive environment despite isatty; fallback to original
                        resp = ''

                    r = resp.strip()
                    if r == '':
                        edited = raw_others
                    elif r.lower() in ['n', 'none', 'n/a']:
                        edited = None
                    elif r.lower() == 'c' and guess:
                        edited = guess
                    else:
                        edited = r
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

            # Allow interactive edits for title/description on each unique title
            title_val = str(raw_title).strip()
            title_norm = title_val.lower() if title_val else None
            edited_title = None
            edited_description = None
            if title_val and title_norm not in title_edit_map:
                if interactive:
                    t_guess, d_guess = guess_title_description(title_val)
                    # Build a clearer multi-line prompt for title/description edits
                    prompt_lines = [f"\nTitle: {title_val}"]
                    if t_guess and t_guess != title_val:
                        prompt_lines.append(f"Title guess: {t_guess}")
                    if d_guess:
                        prompt_lines.append(f"Description guess: {d_guess}")
                    prompt_lines.append("Options: [Enter=keep title] [n=clear description] [c=accept guess] [title|description] [type new title]")
                    prompt_lines.append("Choice: ")
                    prompt = "\n".join(prompt_lines)
                    try:
                        tresp = input(prompt)
                    except EOFError:
                        tresp = ''

                    tr = tresp.strip()
                    if tr == '':
                        edited_title = title_val
                        edited_description = None
                    elif tr.lower() in ['n', 'none', 'n/a']:
                        edited_title = title_val
                        edited_description = None
                    elif tr.lower() == 'c' and (d_guess is not None):
                        edited_title = t_guess if t_guess else title_val
                        edited_description = d_guess
                    else:
                        if '|' in tr:
                            tpart, dpart = tr.split('|', 1)
                            edited_title = tpart.strip() or title_val
                            edited_description = dpart.strip() or None
                        else:
                            # assume user entered a new title only
                            edited_title = tr
                            edited_description = None
                else:
                    # non-interactive: keep original
                    edited_title = title_val
                    edited_description = None

                title_edit_map[title_norm] = (edited_title, edited_description)
            elif title_norm in title_edit_map:
                edited_title, edited_description = title_edit_map[title_norm]

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
                # Lookup department by formatted teacher (e.g. "B. Akin") or by (last, first_initial)
                "department": teacher_dept_map.get(formatted_teacher) or teacher_dept_map.get((l_name.lower(), f_name[0].lower())) if f_name and l_name else None,
                "other_instructors": other_instructors,
                "period": period_map.get(p, 0),
                # Use edited_title if available (from interactive edits), else normalized raw_title
                "title": (edited_title if edited_title is not None else (" ".join(str(raw_title).split()) if pd.notna(raw_title) else None)),
                "description": (edited_description if edited_description is not None else None),
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