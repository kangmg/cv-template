#!/usr/bin/env python3
"""
Generate an editable cv_output.typ file with all data merged inline.
This allows users to directly edit the final Typst document.
"""
import sys
import yaml
import json
from pathlib import Path
from datetime import date

def load_yaml(path: Path) -> dict:
    """Load YAML file and return as dict."""
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def escape_typst(text: str) -> str:
    """Escape special Typst characters."""
    if not text:
        return ""
    # Escape common special characters
    replacements = [
        ("\\", "\\\\"),
        ("#", "\\#"),
        ("$", "\\$"),
        ("@", "\\@"),
        ("<", "\\<"),
        (">", "\\>"),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

def generate_header(cv: dict, meta: dict) -> str:
    """Generate CV header section."""
    profile = cv.get("profile", {})
    theme = meta.get("theme_color", "#26428b")
    font = meta.get("font", "Libertinus Serif")
    font_size = meta.get("font_size", "11pt")
    
    margin = meta.get("margin", {})
    margin_top = margin.get("top", "1cm")
    margin_bottom = margin.get("bottom", "0.5cm")
    margin_left = margin.get("left", "1cm")
    margin_right = margin.get("right", "1cm")
    
    return f'''// CV Template - Generated on {date.today().isoformat()}
// This file is editable. Modify freely for customization.

#import "@preview/clickworthy-resume:1.0.1": *

// ============================================
// CV Settings
// ============================================
#let theme = rgb("{theme}")
#let font = "{font}"
#let fontSize = {font_size}
#let lang = "{meta.get("lang", "en")}"
#let margin = (
  top: {margin_top},
  bottom: {margin_bottom},
  left: {margin_left},
  right: {margin_right},
)

// ============================================
// Personal Information
// ============================================
#let name = "{escape_typst(profile.get("name", "Your Name"))}"
#let contacts = (
  link("mailto:{profile.get("email", "")}")[{escape_typst(profile.get("email", ""))}],
  link("https://{profile.get("github", "")}")[{escape_typst(profile.get("github", ""))}],
)

// ============================================
// CV Header
// ============================================
#show: resume.with(
  author: name,
  location: "",
  contacts: contacts,
  summary: align(right)[#text(size: 8pt, fill: gray)[Last updated: #datetime.today().display("[month repr:long] [day], [year]")]],
  theme-color: theme,
  font: font,
  font-size: fontSize,
  lang: lang,
  margin: margin,
)

'''

def generate_text_block(name: str, data, cv: dict) -> str:
    """Generate text_block template section."""
    content = data if isinstance(data, str) else ""
    keywords = cv.get("keywords", [])
    
    result = f'''// ============================================
= {name}
// ============================================
#align(left)[{escape_typst(content.strip())}]
'''
    if keywords:
        keywords_str = ", ".join(keywords)
        result += f'\n*Keywords*: {escape_typst(keywords_str)}\n'
    
    return result + "\n"

def generate_skills_list(name: str, data: dict) -> str:
    """Generate skills_list template section with single column layout."""
    if not data or not isinstance(data, dict):
        return ""
    
    result = f'''// ============================================
= {name}
// ============================================
'''
    
    for category, items in data.items():
        category_display = category.replace("_", " ")
        result += f'*{escape_typst(category_display)}*\n'
        if isinstance(items, list):
            for item in items:
                result += f'- {escape_typst(str(item))}\n'
        result += '\n'
    
    return result

def generate_experience_list(name: str, data: list) -> str:
    """Generate experience_list template section."""
    if not data or not isinstance(data, list):
        return ""
    
    result = f'''// ============================================
= {name}
// ============================================
'''
    for exp in data:
        title = escape_typst(exp.get("title", ""))
        duration = escape_typst(exp.get("duration", ""))
        org = escape_typst(exp.get("organization", exp.get("lab", "")))
        advisor = escape_typst(exp.get("advisor", ""))
        link = exp.get("link", "")
        
        org_display = f'link("{link}")[{link}]' if link else f'"{org}"'
        
        result += f'''#exp(
  title: "{title}",
  organization: {org_display},
  date: "{duration}",
  location: "{advisor}",
  details: list(
'''
        achievements = exp.get("achievements", [])
        for ach in achievements:
            result += f'    [- {escape_typst(ach)}],\n'
        
        result += '''  ),
)

'''
    
    return result

def generate_education(name: str, data) -> str:
    """Generate education template section - supports both single dict and list."""
    if not data:
        return ""
    
    # Handle both old format (single dict) and new format (list of dicts)
    degrees = data if isinstance(data, list) else [data]
    
    result = f'''// ============================================
= {name}
// ============================================
'''
    
    for degree in degrees:
        if not isinstance(degree, dict):
            continue
            
        degree_name = escape_typst(degree.get("degree", ""))
        field = escape_typst(degree.get("field", ""))
        university = escape_typst(degree.get("university", ""))
        duration = escape_typst(degree.get("duration", ""))
        gpa = escape_typst(degree.get("gpa", ""))
        
        result += f'''#exp(
  title: "{degree_name}",
  organization: "{university}",
  date: "{duration}",
  location: "{field}",
  details: list("GPA: {gpa}"),
)

'''
    
    return result

def generate_publications(name: str, data: list) -> str:
    """Generate publications template section."""
    if not data or not isinstance(data, list):
        return ""
    
    result = f'''// ============================================
= {name}
// ============================================
'''
    
    for i, pub in enumerate(data, 1):
        title = escape_typst(pub.get("title", ""))
        authors = escape_typst(pub.get("authors", ""))
        journal = escape_typst(pub.get("journal", ""))
        year = escape_typst(pub.get("year", ""))
        volume = escape_typst(pub.get("volume", ""))
        pages = escape_typst(pub.get("pages", ""))
        doi = pub.get("doi", "")
        
        # Format citation
        citation = f"{authors}. \"{title}.\" _{journal}_ *{year}*"
        if volume:
            citation += f", {volume}"
        if pages:
            citation += f", {pages}"
        citation += "."
        
        result += f'''#{i}. {citation}
'''
        if doi:
            result += f'   DOI: link("https://doi.org/{doi}")[{doi}]\n'
        result += '\n'
    
    return result

def generate_awards(name: str, data: list) -> str:
    """Generate awards template section."""
    if not data or not isinstance(data, list):
        return ""
    
    result = f'''// ============================================
= {name}
// ============================================
'''
    for award in data:
        award_name = escape_typst(award.get("name", ""))
        institution = escape_typst(award.get("institution", ""))
        year = escape_typst(award.get("year", ""))
        amount = escape_typst(award.get("amount", ""))
        
        details = f'{institution}, {year}'
        if amount:
            details += f', {amount}'
        
        result += f'''#exp(
  title: "{award_name}",
  details: list("{details}"),
)

'''
    
    return result

def generate_single_entry(name: str, data: dict, source_key: str) -> str:
    """Generate single_entry template section."""
    if not data or not isinstance(data, dict):
        return ""
    
    if source_key == "military_service":
        branch = escape_typst(data.get("branch", ""))
        rank = escape_typst(data.get("rank", ""))
        duration = escape_typst(data.get("duration", ""))
        
        return f'''// ============================================
= {name}
// ============================================
#exp(
  title: "{branch} ({rank})",
  date: "{duration}",
  details: list([- Completed mandatory service.]),
)

'''
    else:
        activity = escape_typst(data.get("activity", ""))
        duration = escape_typst(data.get("duration", ""))
        description = escape_typst(data.get("description", ""))
        
        return f'''// ============================================
= {name}
// ============================================
#exp(
  title: "{activity}",
  date: "{duration}",
  details: list([- {description}]),
)

'''

def main():
    base_dir = Path(__file__).resolve().parent.parent
    
    # Load configuration files
    cv_path = base_dir / "cv.yml"
    template_path = base_dir / "template.yml"
    output_path = base_dir / "output" / "cv_output.typ"
    
    if not cv_path.exists():
        print(f"Error: {cv_path} not found")
        sys.exit(1)
    
    if not template_path.exists():
        print(f"Error: {template_path} not found")
        sys.exit(1)
    
    cv = load_yaml(cv_path)
    template = load_yaml(template_path)
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Generate Typst content
    meta = template.get("meta", {})
    sections = template.get("sections", [])
    
    content = generate_header(cv, meta)
    
    # Template generators mapping
    generators = {
        "text_block": generate_text_block,
        "skills_list": generate_skills_list,
        "experience_list": generate_experience_list,
        "education": generate_education,
        "publications": generate_publications,
        "awards": generate_awards,
        "single_entry": generate_single_entry,
    }
    
    for section in sections:
        section_name = section.get("name", "")
        template_type = section.get("template", "")
        source_key = section.get("source", "")
        enabled = section.get("enabled", True)
        
        if not enabled:
            continue
        
        data = cv.get(source_key)
        if data is None:
            continue
        
        generator = generators.get(template_type)
        if generator:
            if template_type == "single_entry":
                content += generator(section_name, data, source_key)
            elif template_type == "text_block":
                content += generator(section_name, data, cv)
            else:
                content += generator(section_name, data)
    
    # Write output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Generated: {output_path}")

if __name__ == "__main__":
    main()
