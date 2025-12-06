# Template Reference

This document describes each template type and its required fields in `cv.yml`.

---

## text_block

Simple paragraph text for summaries and descriptions.

### cv.yml Format

```yaml
research_interest: |
  Your multiline text goes here.
  Supports line breaks and paragraphs.
```

### Optional: Keywords

```yaml
keywords:
  - "Keyword 1"
  - "Keyword 2"
```

---

## skills_list

Categorized skill list with headings.

### cv.yml Format

```yaml
skills:
  Category Name:
    - "Skill item 1"
    - "Skill item 2"
  Another Category:
    - "Another skill"
```

Category names can be customized freely (e.g., `프로그래밍`, `Languages`).

---

## experience_list

Timeline entries with details. Used for research experience, projects, etc.

### cv.yml Format

```yaml
research_experience:
  - title: "Position or Project Title"
    duration: "Start - End"
    organization: "Lab or Company Name"
    advisor: "Advisor Name"  # optional
    achievements:
      - "Achievement 1"
      - "Achievement 2"
```

### For Projects

```yaml
projects:
  - title: "Project Name"
    link: "https://github.com/..."  # optional
    duration: "2024"                 # optional
    extra:                           # optional tags
      - "Tag 1"
    achievements:
      - "Description"
```

---

## education

Education information (single entry).

### cv.yml Format

```yaml
education:
  university: "University Name"
  duration: "Start - End"
  degree: "B.S. in Major"
  gpa: "4.0 / 4.5"
```

---

## awards

Award, scholarship, or grant entries.

### cv.yml Format

```yaml
scholarships:
  - name: "Award Name"
    institution: "Awarding Body"
    year: "2024"
    amount: "USD 5,000"  # optional
```

Same format for `awards_honors` and `grants`.

---

## single_entry

Single activity entry.

### cv.yml Format (Additional Activity)

```yaml
additional_activity:
  activity: "Activity Name"
  duration: "Start - End"
  description: "Description text"
```

### cv.yml Format (Military Service)

```yaml
military_service:
  branch: "Army"
  rank: "Sergeant"
  duration: "Start - End"
```
