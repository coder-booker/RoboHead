import os
import re

def rewrite(src_dir, file_name, num):
    file_path = os.path.join(src_dir, file_name)
    with open(file_name, 'r') as f:
        lines = f.readlines()

    pattern = re.compile(r"const DEFAULT_PORT = parseInt\(process\.env\.PORT, 10\) \|\| ")
    
    # 修改包含特定字符串的行
    for i, line in enumerate(lines):
        if 'const DEFAULT_PORT = parseInt(process.env.PORT, 10) || ' in line:
            match = pattern.search(line)
            if match:
                print(match.end())
                lines[i] = line[:match.end()] + str(num) + ";\n"

    # 将修改后的内容写回文件
    with open(file_path, 'w') as file:
        file.writelines(lines)

# 示例用法
rewrite(r'/home/booker/RoboHead\RoboHead\control-panel\node_modules\react-scripts\scripts', 'start.js', 11451)
rewrite(r'/home/booker/RoboHead\RoboHead\face\node_modules\react-scripts\scripts', 'start.js', 11452)
rewrite(r'/home/booker/RoboHead\RoboHead\faceMonitor\node_modules\react-scripts\scripts', 'start.js', 11453)
# rewrite(r'', 'start.js', 11452)
# rewrite(r'', 'start.js', 11453)
