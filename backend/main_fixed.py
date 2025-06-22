from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import time
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Configuration LM Studio
LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"
DEFAULT_MODEL = "deepseek-coder-v2-lite-instruct"  # À adapter selon votre modèle

@app.get("/")
async def root():
    """Point d'entrée de l'API avec informations de statut"""
    return {
        "service": "Veridia Backend",
        "version": "1.0.0",
        "status": "active",
        "lm_studio_url": LM_STUDIO_API_URL
    }

@app.get("/api/health")
async def health_check():
    """Vérification de l'état de santé et connexion à LM Studio"""
    try:
        # Test de connexion à LM Studio
        test_response = requests.get(LM_STUDIO_API_URL.replace('/chat/completions', '/models'), timeout=5)
        lm_studio_status = "connected" if test_response.status_code == 200 else "disconnected"
        available_models = []
        
        if test_response.status_code == 200:
            models_data = test_response.json()
            if 'data' in models_data:
                available_models = [model['id'] for model in models_data['data']]
                
    except Exception as e:
        logger.error(f"Erreur de connexion LM Studio: {e}")
        lm_studio_status = "error"
        available_models = []

    return {
        "backend_status": "healthy",
        "lm_studio_status": lm_studio_status,
        "available_models": available_models,
        "timestamp": time.time()
    }

@app.post("/api/generate")
async def generate_code(request: Request):
    """Génération de code avec statistiques détaillées"""
    start_time = time.time()
    
    try:
        data = await request.json()
        prompt = data.get("prompt", "")
        
        if not prompt.strip():
            raise HTTPException(status_code=400, detail="Le prompt ne peut pas être vide")
        
        # Préparation de la requête pour LM Studio
        payload = {
            "model": DEFAULT_MODEL,
            "messages": [
                {
                    "role": "system", 
                    "content": "Tu es un assistant de programmation expert. Génère du code de haute qualité, bien commenté et explique brièvement son fonctionnement."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "max_tokens": 2048,
            "temperature": 0.7,
            "stream": False
        }
        
        # Temps avant l'envoi de la requête
        request_start = time.time()
        
        logger.info(f"Envoi de la requête à LM Studio: {prompt[:100]}...")
        
        # Envoi de la requête à LM Studio
        response = requests.post(
            LM_STUDIO_API_URL, 
            json=payload,
            timeout=120  # Timeout de 2 minutes
        )
        
        request_end = time.time()
        
        if response.status_code != 200:
            logger.error(f"Erreur LM Studio: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Erreur du serveur LM Studio: {response.text}"
            )
        
        # Parse de la réponse avec gestion d'erreur améliorée
        try:
            result = response.json()
            logger.info(f"Réponse LM Studio reçue: {len(response.text)} caractères")
        except Exception as json_error:
            logger.error(f"Erreur parsing JSON LM Studio: {json_error}")
            logger.error(f"Contenu brut de la réponse: {response.text[:500]}")
            raise HTTPException(status_code=500, detail=f"Erreur parsing réponse LM Studio: {str(json_error)}")
        
        # Calcul des statistiques
        total_time = time.time() - start_time
        lm_studio_time = request_end - request_start
        processing_time = total_time - lm_studio_time
        
        # Extraction des informations depuis la réponse LM Studio
        generated_text = result.get('choices', [{}])[0].get('message', {}).get('content', 'Erreur: pas de contenu généré')
        
        # Informations sur les tokens
        usage_info = result.get('usage', {})
        prompt_tokens = usage_info.get('prompt_tokens', 0)
        completion_tokens = usage_info.get('completion_tokens', 0)
        total_tokens = usage_info.get('total_tokens', prompt_tokens + completion_tokens)
        
        # Création de la réponse enrichie
        enhanced_response = {
            "choices": [
                {
                    "message": {
                        "content": generated_text,
                        "role": "assistant"
                    }
                }
            ],
            "usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens
            },
            "timing": {
                "total_time_ms": round(total_time * 1000, 2),
                "lm_studio_time_ms": round(lm_studio_time * 1000, 2),
                "processing_time_ms": round(processing_time * 1000, 2)
            },
            "metadata": {
                "timestamp": time.time(),
                "backend_version": "1.0.0",
                "prompt_length": len(prompt),
                "response_length": len(generated_text)
            }
        }
        
        logger.info(f"Génération terminée en {total_time:.2f}s - {total_tokens} tokens")
        
        return enhanced_response
        
    except requests.exceptions.Timeout:
        logger.error("Timeout lors de la requête à LM Studio")
        raise HTTPException(status_code=408, detail="Timeout: LM Studio met trop de temps à répondre")
    
    except requests.exceptions.ConnectionError:
        logger.error("Impossible de se connecter à LM Studio")
        raise HTTPException(
            status_code=503, 
            detail="Impossible de se connecter à LM Studio. Vérifiez qu'il est démarré et accessible."
        )
    
    except Exception as e:
        total_time = time.time() - start_time
        logger.error(f"Erreur inattendue après {total_time:.2f}s: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

@app.get("/api/stats")
async def get_server_stats():
    """Statistiques du serveur backend"""
    return {
        "server_info": {
            "name": "Veridia Backend",
            "version": "1.0.0",
            "uptime": time.time()
        },
        "configuration": {
            "lm_studio_url": LM_STUDIO_API_URL,
            "default_model": DEFAULT_MODEL
        }
    }
