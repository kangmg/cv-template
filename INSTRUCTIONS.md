# CV Template - LLM Instructions

This document provides structured instructions for LLMs to understand and modify this CV template project.

## Project Overview

This is an automated CV generation system that converts YAML configuration files into:
- **PDF** (via Typst)
- **Web UI** (via React + Vite)
- **Auto-deployment** to GitHub Pages

## Core Architecture

### Input Files (User Edits These)
1. **cv.yml** - CV content data
2. **template.yml** - Section configuration and ordering
3. **gallery.yml** - Project gallery data

### Output
- `output/CV.pdf` - Generated PDF
- `output/cv_output.typ` - Typst source (editable)
- Deployed website at `https://[username].github.io/[repo-name]/`

## File Structure

```
CV_template/
├── cv.yml                    # Main CV data
├── template.yml              # Section configuration
├── gallery.yml               # Project gallery
├── asset/                    # Gallery images
├── scripts/
│   ├── yml2json.py          # YAML → JSON converter
│   ├── generate_typst.py    # JSON → Typst generator
│   └── compile.sh           # Local build script
├── typst/
│   ├── typst                # Typst binary
│   └── templates/           # Typst template files
├── web/
│   ├── src/
│   │   ├── App.jsx          # React main component
│   │   └── App.css          # Styles (GitHub dark mode)
│   └── public/data/         # JSON files for web
└── .github/workflows/
    └── deploy.yml           # GitHub Actions workflow
```

## Configuration Files

### 1. cv.yml Structure

```yaml
profile:
  name: "Your Name"
  title: "Your Title"
  email: "email@example.com"
  github: "github.com/username"
  blog: "yourblog.com"
  update: "YYYY-MM-DD"

research_interest: |
  Multi-line text description

keywords:
  - "Keyword 1"
  - "Keyword 2"

skills:
  Category_Name:
    - "Skill 1"
    - "Skill 2"

research_experience:
  - title: "Position Title"
    duration: "Start - End"
    organization: "Organization Name"
    advisor: "Advisor: Name"  # optional
    achievements:
      - "Achievement 1"
      - "Achievement 2"

education:  # List of degrees
  - degree: "Ph.D. in Field"
    field: "Specialization"
    university: "University Name"
    duration: "Start - End"
    gpa: "X.XX / 4.00"

publications:
  - title: "Paper Title"
    authors: "Author1, Author2, Author3"
    journal: "Journal Name"
    year: "YYYY"
    volume: "Vol(Issue)"
    pages: "page-range"
    doi: "10.xxxx/xxxxx"

awards:
  - name: "Award Name"
    institution: "Institution"
    year: "YYYY"
    amount: "$X,XXX"  # optional
```

### 2. template.yml Structure

```yaml
meta:
  title: "Curriculum Vitae"
  theme_color: "#26428b"
  font: "Libertinus Serif"
  font_size: 11pt

sections:
  - name: "Display Name"
    template: "template_type"
    source: "cv_yml_key"
    enabled: true  # optional, default true
```

**Available Templates:**
- `text_block` - Paragraph text with optional keywords
- `skills_list` - Categorized skill lists (2-column web, 1-column PDF)
- `experience_list` - Timeline entries with achievements
- `education` - Education entries (supports multiple degrees)
- `publications` - Numbered publication list with DOI links
- `awards` - Award/scholarship entries
- `single_entry` - Single item (e.g., military service)

### 3. gallery.yml Structure

```yaml
project_highlights:
  - title: "Project Name"
    image: "asset/image.png"
    period: "YYYY"
    descriptions:
      - "Bullet point 1"
      - "Bullet point 2"
      - "Bullet point 3"
    custom_tag: "Tag1, Tag2, Tag3"
    is_team: true/false
```

## Styling Guidelines

### Web UI (App.css)
- **Color Scheme**: GitHub-inspired dark/light mode
- **Typography**: System fonts, -apple-system fallback
- **Layout**: Max-width 1200px, responsive
- **Components**: Card-based sections with subtle shadows

### CSS Variables
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1f2328;
  --accent-color: #0969da;
  /* ... */
}

[data-theme='dark'] {
  --bg-primary: #0d1117;
  --text-primary: #e6edf3;
  --accent-color: #2f81f7;
  /* ... */
}
```

### Design Principles
1. **Academic Style**: Clean, professional, minimal
2. **No Emojis**: Use Lucide React icons only
3. **Monochromatic**: Grayscale with accent color
4. **Responsive**: Mobile-first, breakpoint at 768px

## Common Modifications

### Adding a New Section

1. **Add data to cv.yml:**
```yaml
new_section:
  - item: "value"
```

2. **Add to template.yml:**
```yaml
sections:
  - name: "New Section"
    template: "experience_list"  # or appropriate template
    source: "new_section"
```

3. **If new template needed, update:**
- `scripts/generate_typst.py` - Add generator function
- `web/src/App.jsx` - Add React component
- `web/src/App.css` - Add styles

### Changing Section Order
Simply reorder entries in `template.yml` sections array.

### Hiding a Section
```yaml
- name: "Section Name"
  template: "template_type"
  source: "data_key"
  enabled: false
```

### Customizing Colors
Edit CSS variables in `web/src/App.css`:
```css
:root {
  --accent-color: #your-color;
}
```

## Build Process

### Local Development
```bash
# Generate JSON and PDF
./scripts/compile.sh

# Run web dev server
cd web && npm run dev
```

### GitHub Actions Workflow
1. Checkout code
2. Install Python dependencies
3. Generate JSON files (`yml2json.py`)
4. Generate Typst file (`generate_typst.py`)
5. Compile PDF (Typst binary)
6. Install Node.js dependencies
7. Copy data/assets to `web/public/`
8. Build Vite project
9. Deploy to GitHub Pages

## Key Implementation Details

### Typst Escaping
Special characters in YAML must be escaped for Typst:
```python
def escape_typst(text):
    text = text.replace("\\", "\\\\")
    text = text.replace("\"", "\\\"")
    text = text.replace("@", "\\@")  # Prevents label reference
    return text
```

### Dynamic Base Path
Vite uses environment variable for GitHub Pages subdirectory:
```javascript
// vite.config.js
base: process.env.BASE_PATH || '/',
```

```yaml
# deploy.yml
env:
  BASE_PATH: /${{ github.event.repository.name }}/
```

### Gallery Images
- Store in `asset/` folder
- Reference in `gallery.yml` as `asset/filename.png`
- Workflow copies to `web/public/asset/`

## Troubleshooting

### PDF Not Generating
- Check Typst syntax in `output/cv_output.typ`
- Verify all `@` symbols are escaped
- Check `scripts/generate_typst.py` for errors

### Images Not Loading
- Ensure `asset/` folder is copied in workflow
- Check image paths in `gallery.yml`
- Verify images exist in repository

### Deployment Fails
- Check GitHub Actions logs
- Verify Pages source is set to "GitHub Actions"
- Ensure workflow has `contents: write` permission

## Best Practices

1. **Keep descriptions concise** - 2-3 bullet points max
2. **Use consistent formatting** - Follow existing patterns
3. **Test locally first** - Run `./scripts/compile.sh`
4. **Commit incrementally** - One logical change per commit
5. **Use placeholders** - Never commit real personal data in template

## File Download Links

After deployment, files are accessible at:
- PDF: `https://[username].github.io/[repo-name]/data/CV.pdf`
- Typst: `https://[username].github.io/[repo-name]/data/cv_output.typ`
- JSON: `https://[username].github.io/[repo-name]/data/*.json`
