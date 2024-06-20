## This script could help to find out which messages should be translated. `en.json5` to `cs.json5`.
import csv
import json5

# txt_file_lines = ['{']
txt_file_lines = []
json_file_lines = []
missing = []

# Open csv file with translated messages
# with open("filename.csv", encoding="utf8") as csvfile:
#     csvreader = csv.reader(csvfile, delimiter=";")
#
#     for name, en, cs in csvreader:
#         if name == '﻿id':
#             continue
#         line1 = '\n'
#         line2 = '  // \"' + name.strip() + '\"' + ' : ' + "\"" + en.strip() + "\"" + "\n"
#         line3 = '  \"' + name.strip() + '\"' + ' : ' + "\"" + cs.strip() + "\"" + ","
#         txt_file_lines.append(line1 + line2 + line3)
# txt_file_lines.append('}')

# Load json5 file messages
# with open('en.json5', encoding="utf8") as f:
#   json_p = json5.load(f)
#   for name in json_p:
#     json_file_lines.append(name)

# Check missing messages based on the message name
# for name in cs_7_5_names:
#   if name not in test_names:
#     missing.append(name)

# Store new messages into *.txt file which content will be copies into some *.json5 file
# with open('translated_tul_cl_json.txt', 'w', encoding='utf-8') as f:
#   f.write('\n'.join(txt_file_lines))

