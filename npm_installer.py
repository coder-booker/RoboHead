import os
import subprocess

def npm_install_in_directories(directories):
    for directory in directories:
        # 切换到目标目录
        os.chdir(directory)
        # 执行 npm install 命令
        result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
        # 打印命令的输出
        print(f"Running 'npm install' in {directory}")
        print(result.stdout)
        print(result.stderr)

# 示例用法
directories = [
    '/home/booker/RoboHead/RoboHead',
    '/home/booker/RoboHead/RoboHead/control-panel',
    '/home/booker/RoboHead/RoboHead/face',
    '/home/booker/RoboHead/RoboHead/faceMonitor'
]

npm_install_in_directories(directories)