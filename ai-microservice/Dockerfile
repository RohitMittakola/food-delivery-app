FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install groq fastapi uvicorn mysql-connector-python python-dotenv aiomysql langchain-groq
EXPOSE 8000
CMD ["python", "main.py"]   