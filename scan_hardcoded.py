import os
import re

# Simple scanner to identify potential hardcoded strings in .tsx files
def scan_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    results = []
    
    # 1. Look for text inside JSX tags: >Text< or >Text{ or }Text< or }Text{
    # We will exclude lines that look like imports, comments, or already have t("...") or use i18n
    # A simple regex to find JSX content between tags
    jsx_text_pat = re.compile(r'>\s*([A-Za-z][A-Za-z0-9\s\'\",.!()\-\[\]?:]+)\s*(<|{)')
    jsx_text_pat2 = re.compile(r'}\s*([A-Za-z][A-Za-z0-9\s\'\",.!()\-\[\]?:]+)\s*(<|{)')
    
    # 2. Look for static string properties in JSX like label="Some Text" or placeholder="Some Text" or title="Some Text"
    attr_pat = re.compile(r'\b(label|placeholder|title|description|name|value|text|message|labelText|heading|subheading)="([A-Za-z0-9\s\'\",.!()\-\[\]?:]+)"')

    for i, line in enumerate(lines):
        line_num = i + 1
        stripped = line.strip()
        
        # Skip import, comment lines
        if stripped.startswith('import ') or stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
            continue
            
        # 1. Tag checks
        m1 = jsx_text_pat.search(line)
        if m1:
            text = m1.group(1).strip()
            if text and not text.startswith('t(') and len(text) > 2:
                results.append((line_num, "JSX Text", text, line.strip()))
                
        m2 = jsx_text_pat2.search(line)
        if m2:
            text = m2.group(1).strip()
            if text and not text.startswith('t(') and len(text) > 2:
                results.append((line_num, "JSX Text (after curly)", text, line.strip()))
                
        # 2. Attribute checks
        for m in attr_pat.finditer(line):
            attr_name = m.group(1)
            val = m.group(2).strip()
            if val and len(val) > 2:
                results.append((line_num, f"JSX Attr ({attr_name})", val, line.strip()))
                
    return results

def main():
    exclude_dirs = ['node_modules', 'dist', '.git', 'dev-dist']
    total_findings = 0
    
    print("=== Scanning Codebase for Hardcoded Strings ===")
    for root, dirs, files in os.walk('src'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(root, file)
                findings = scan_file(file_path)
                if findings:
                    print(f"\nFile: {file_path}")
                    for line_num, f_type, text, raw in findings[:15]: # Show top 15 per file
                        print(f"  Line {line_num:4d} [{f_type}]: \"{text}\"")
                    if len(findings) > 15:
                        print(f"  ... and {len(findings) - 15} more findings in this file")
                    total_findings += len(findings)
                    
    print(f"\n=== Scan complete. Total potential hardcoded strings found: {total_findings} ===")

if __name__ == "__main__":
    main()
