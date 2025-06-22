# Veridia

Veridia is an AI client that connects to a self-hosted LLM model via LM Studio. It enables code analysis, generation, and assistance for various development projects.

## Features
- Connection to LM Studio (local API)
- Modern user interface (React)
- Backend (Python FastAPI)
- Code analysis and generation

## Quick Start
1. Install backend dependencies: `pip install -r backend/requirements.txt`
2. Install frontend dependencies: `cd frontend && npm install`
3. Start the backend: `cd backend && uvicorn main:app --reload`
4. Start the frontend: `cd frontend && npm start`

## Configuration
- Make sure LM Studio is running and accessible via its local API.

## Project Structure
- `backend/` : FastAPI for communicating with LM Studio
- `frontend/` : React user interface

## Coming Soon
- Detailed documentation
- Usage examples
