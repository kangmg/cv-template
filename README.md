# CV Template

A flexible CV builder with customizable sections, Typst-based PDF generation, and a web UI.

## Quick Start

1. **Install Python dependencies**: `pip install -r requirements.txt`
2. **Edit your CV data**: Modify `cv.yml` with your information
3. **Configure sections**: Customize `template.yml` to change section names and order
4. **Generate PDF**: Run `./scripts/compile.sh`
5. **Preview in browser**: Run `cd web && npm install && npm run dev`

## Project Structure

```
CV_template/
├── cv.yml           # Your CV data
├── template.yml     # Section configuration
├── gallery.yml      # Project gallery data
├── typst/           # Typst templates
├── scripts/         # Build scripts
├── output/          # Generated files (PDF, Typst)
└── web/             # Web UI
```

## Configuration

### template.yml

Define which sections appear and in what order:

```yaml
sections:
  - name: "Research Interest"   # Section title (customizable)
    template: "text_block"       # Template type
    source: "research_interest"  # Key in cv.yml
```

### cv.yml

Your CV content organized by data type. See [docs/templates.md](docs/templates.md) for field requirements.

## Template Types

| Template | Description | Use Case |
|----------|-------------|----------|
| `text_block` | Paragraph text | Research interest, summary |
| `skills_list` | Categorized lists | Skills, languages |
| `experience_list` | Timeline entries | Experience, projects |
| `education` | Education info | Degrees, certifications |
| `awards` | Award entries | Scholarships, grants |
| `single_entry` | Single item | Military, one-off activities |

See [docs/templates.md](docs/templates.md) for detailed field specifications.

## Scripts

- `./scripts/compile.sh` - Generate PDF
- `./scripts/generate_typst.py` - Create editable `cv_output.typ`
- `./scripts/yml2json.py` - Convert YAML to JSON

## Web UI

```bash
cd web
npm install
npm run dev
```

## License

MIT
