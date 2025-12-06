#!/usr/bin/env python3
"""
YAML to JSON converter for Typst consumption.
Typst can read JSON files natively but not YAML.
"""
import sys
import yaml
import json
from pathlib import Path

def main():
    if len(sys.argv) < 3:
        print(f"Usage: python {Path(__file__).name} <input_yaml> <output_json>")
        sys.exit(1)

    base_dir = Path(__file__).resolve().parent.parent

    input_yaml = (base_dir / Path(sys.argv[1])).resolve()
    output_json = (base_dir / Path(sys.argv[2])).resolve()

    # Ensure output directory exists
    output_json.parent.mkdir(parents=True, exist_ok=True)

    # YAML → dict
    with open(input_yaml, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    # dict → JSON
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Converted: {input_yaml.name} → {output_json.name}")

if __name__ == "__main__":
    main()
