from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI(
    title="Veridia API",
    description="AI Code Assistant API that connects to LM Studio",
    version="1.0.0"
)

# Autoriser le frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"  # À adapter si besoin

@app.post("/api/generate")
async def generate_code(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")
    payload = {
        "model": "deepseek-coder-v2-lite-instruct",  # À adapter
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 512
    }
    response = requests.post(LM_STUDIO_API_URL, json=payload)
    return response.json()
