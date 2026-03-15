# 基础镜像
# FROM python:3.9-slim
FROM python:3.10.0
# FROM mirror.tuna.tsinghua.edu.cn/python/3.9.0

# 设置工作目录
WORKDIR /app
# 复制依赖文件
COPY requirements.txt .

# 安装依赖
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
COPY requirements.txt .
RUN pip install --no-cache-dir \
    --timeout 100 \
    gunicorn>=21.2.0 \
    -r requirements.txt && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm -rf ~/.cache/pip

# 创建需要挂载的目录（作为挂载点）
RUN mkdir -p /app/file

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 1005

# 启动命令
CMD ["python", "run.py"]