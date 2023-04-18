import json
import os
import re

BLOG_FILES = os.listdir("blogs/")
DATA = {}

def normalize_str(string: str):
    string = string.replace(" ", "-").lower()
    string = re.sub(r"[^a-zA-Z0-9\-_]", "", string)
    return string

for FILE in BLOG_FILES:
    TITLE = ""
    SUMMARY = ""
    WRITTEN_ON = ""

    with open(os.path.join("blogs", FILE), "r") as content:
        content = content.read()
        try:
            header = re.search(r"<!--BLOG_HEADER(.*)-->", content, flags=re.DOTALL).group(1)
        except AttributeError:
            print("ERROR: No header found in file: " + FILE)
            continue

        for data in header.split("\n"):
            def new_data(): return data.split(": ")[1].strip()
            if "SUMMARY:" in data:
                SUMMARY = new_data()
                continue
            if "DATE:" in data:
                WRITTEN_ON = new_data()
                continue
            if "TIME:" in data:
                WRITTEN_ON += " " + new_data()
                continue

        for line in content.split("\n"):
            if line.startswith("# "):
                TITLE = line[2:]
                break

        if TITLE == "":
            print("WARNING: Could not find a title for " + FILE)

        DATA[normalize_str(TITLE)] = {
            "title": TITLE,
            "summary": SUMMARY,
            "written_on": WRITTEN_ON,
            "file": FILE
        }

with open("./index.json", "w") as data:
    json.dump(DATA, data, indent=4)