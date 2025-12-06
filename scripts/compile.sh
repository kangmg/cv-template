#!/bin/bash
# Compile CV to PDF
# Usage: ./compile.sh
# 
# This script:
# 1. Converts YAML files to JSON for web UI
# 2. Generates editable cv_output.typ
# 3. Compiles cv_output.typ to PDF

set -euo pipefail

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Paths
CV_YAML="$PROJECT_ROOT/cv.yml"
TEMPLATE_YAML="$PROJECT_ROOT/template.yml"
GALLERY_YAML="$PROJECT_ROOT/gallery.yml"
DATA_DIR="$PROJECT_ROOT/data"
OUTPUT_DIR="$PROJECT_ROOT/output"
TYPST_OUTPUT="$OUTPUT_DIR/cv_output.typ"
PDF_OUTPUT="$OUTPUT_DIR/CV.pdf"
YML2JSON="$SCRIPT_DIR/yml2json.py"
GENERATE_TYPST="$SCRIPT_DIR/generate_typst.py"

# Create directories
mkdir -p "$DATA_DIR"
mkdir -p "$OUTPUT_DIR"

# Step 1: Convert YAML to JSON (for web UI)
echo "Converting YAML to JSON..."
python3 "$YML2JSON" "cv.yml" "data/cv-data.json"
python3 "$YML2JSON" "template.yml" "data/template.json"
python3 "$YML2JSON" "gallery.yml" "data/gallery.json"

# Step 2: Generate editable Typst file
echo "Generating cv_output.typ..."
python3 "$GENERATE_TYPST"

# Step 3: Compile to PDF
echo "Compiling to PDF..."
TYPST_BIN="$PROJECT_ROOT/typst/typst"
if command -v typst &> /dev/null; then
    typst compile --root "$PROJECT_ROOT" "$TYPST_OUTPUT" "$PDF_OUTPUT"
    echo "PDF generated: $PDF_OUTPUT"
elif [ -f "$TYPST_BIN" ]; then
    "$TYPST_BIN" compile --root "$PROJECT_ROOT" "$TYPST_OUTPUT" "$PDF_OUTPUT"
    echo "PDF generated: $PDF_OUTPUT"
else
    echo "Warning: typst binary not found. Skipping PDF compilation."
    echo "Install typst or place the binary in $PROJECT_ROOT/typst/"
fi

# Copy PDF to web public folder if it exists
WEB_PUBLIC="$PROJECT_ROOT/web/public/data"
if [ -d "$PROJECT_ROOT/web" ]; then
    mkdir -p "$WEB_PUBLIC"
    if [ -f "$PDF_OUTPUT" ]; then
        cp "$PDF_OUTPUT" "$WEB_PUBLIC/"
        echo "PDF copied to web/public/data/"
    fi
fi

echo "Done!"
