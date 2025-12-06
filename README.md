# CV Template

> [한국어](README_KR.md) | **English**

**Just edit YAML files and your CV website + PDF are automatically generated!**

## Quick Start (5 min)

### Step 1: Fork Repository
1. Fork this repository
2. Go to Settings → Pages → Set Source to **GitHub Actions**

### Step 2: Edit Your Info (cv.yml)
Open `cv.yml` and update with your information:

```yaml
# Basic Info
profile:
  name: "John Doe"
  title: "Backend Developer"
  email: "john@example.com"
  github: "github.com/johndoe"
  update: "2025-01-01"

# About Me
research_interest: |
  I am passionate about web development...

# Skills
skills:
  Programming:
    - "Python, JavaScript"
    - "React, Node.js"
  Languages:
    - "English (Native)"
    - "Korean (Intermediate)"

# Experience
research_experience:
  - title: "Backend Developer"
    duration: "Jan 2023 - Present"
    organization: "Company Name"
    achievements:
      - "Developed and maintained API servers"
      - "Improved performance by 50%"

# Education
education:
  university: "University Name"
  duration: "Mar 2019 - Feb 2023"
  degree: "B.S. in Computer Science"
  gpa: "4.0 / 4.5"
```

### Step 3: Push and Auto Deploy!
After committing your changes:
- ✅ PDF generated
- ✅ Website deployed
- 📍 `https://[username].github.io/[repo-name]/`
- 📄 Download PDF: `https://[username].github.io/[repo-name]/data/CV.pdf`

---

## Section Customization (template.yml)

Change section order, rename, or disable sections:

```yaml
sections:
  - name: "About Me"            # Display name
    template: "text_block"       # Template type
    source: "research_interest"  # Key in cv.yml

  - name: "Experience"
    template: "experience_list"
    source: "research_experience"

  - name: "Hidden Section"
    template: "awards"
    source: "awards"
    enabled: false               # Set false to hide
```

### Available Templates

| Template | Use Case | Example |
|----------|----------|---------|
| `text_block` | Text paragraph | About me, Summary |
| `skills_list` | Categorized list | Skills, Languages |
| `experience_list` | Timeline format | Experience, Projects |
| `education` | Education info | University |
| `awards` | Award entries | Scholarships, Honors |
| `single_entry` | Single item | Military service |

See [docs/templates.md](docs/templates.md) for detailed field specs.

---

## Project Gallery (gallery.yml)

```yaml
project_highlights:
  - title: "Project Name"
    image: "asset/screenshot.png"
    period: "Jan 2024"
    descriptions:
      - "Key feature description"
    custom_tag: "React, TypeScript"
    is_team: true
```

---

## Local Development (Optional)

```bash
# 1. Install dependencies
pip install -r requirements.txt
cd web && npm install && cd ..

# 2. Generate PDF and JSON
./scripts/compile.sh

# 3. Local preview
cd web && npm run dev
```

---

## Structure

```
├── cv.yml           # Your CV data
├── template.yml     # Section config
├── gallery.yml      # Gallery data
├── scripts/         # Build scripts
├── typst/           # PDF generator
└── web/             # Web UI
```