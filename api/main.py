
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import json
from typing import Optional, Dict, Any, List

app = FastAPI(title="SQL Validator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class QueryValidationRequest(BaseModel):
    challenge: Dict[str, Any]
    query: str
    user_id: Optional[str] = None

class ValidationResponse(BaseModel):
    is_correct: bool
    feedback: str
    table_data: Optional[List[Dict[str, Any]]] = None

# Environment variables (to be set in your deployment environment)
AI_ENDPOINT = os.getenv("AI_ENDPOINT", "https://your-ngrok-url-here.ngrok.io/validate")
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://yfaqgwzavulccnhisxxl.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Routes
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/validate_query", response_model=ValidationResponse)
async def validate_query(request: QueryValidationRequest):
    # 1. Construct the prompt for the AI model
    prompt = f"""
Challenge: {request.challenge['title']}
Description: {request.challenge['description']}

Student's SQL Query:
```sql
{request.query}
```

Is this query correct for the challenge? Provide feedback.
"""

    # 2. Send to AI model for validation
    try:
        async with httpx.AsyncClient() as client:
            ai_response = await client.post(
                AI_ENDPOINT,
                json={"prompt": prompt},
                timeout=30.0
            )
            ai_data = ai_response.json()
            
            # Parse AI response
            is_correct = ai_data.get("is_correct", False)
            feedback = ai_data.get("feedback", "Unable to validate query.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with AI model: {str(e)}")

    # 3. If correct, execute the query on Supabase
    table_data = None
    if is_correct:
        try:
            # Call Supabase to execute the query
            async with httpx.AsyncClient() as client:
                headers = {
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
                
                execute_response = await client.post(
                    f"{SUPABASE_URL}/rest/v1/rpc/execute_sql_learning_query",
                    headers=headers,
                    json={"sql_query": request.query},
                    timeout=15.0
                )
                
                if execute_response.status_code == 200:
                    table_data = execute_response.json()
                else:
                    # Query was correct according to AI but failed in execution
                    feedback += "\n\nHowever, there was an error executing the query: " + execute_response.text
                    is_correct = False
                    
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error executing query: {str(e)}")

    # 4. If user_id is provided, save progress to Supabase
    if is_correct and request.user_id and 'id' in request.challenge:
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json"
                }
                
                # Check if record exists
                check_response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/user_levels?user_id=eq.{request.user_id}&level_id=eq.{request.challenge['id']}",
                    headers=headers
                )
                
                if check_response.status_code == 200 and len(check_response.json()) > 0:
                    # Update existing record
                    record_id = check_response.json()[0]['id']
                    await client.patch(
                        f"{SUPABASE_URL}/rest/v1/user_levels?id=eq.{record_id}",
                        headers=headers,
                        json={"completed_at": "now()"}
                    )
                else:
                    # Create new record
                    await client.post(
                        f"{SUPABASE_URL}/rest/v1/user_levels",
                        headers=headers,
                        json={
                            "user_id": request.user_id,
                            "level_id": request.challenge['id'],
                            "completed_at": "now()"
                        }
                    )
        except Exception as e:
            print(f"Error saving progress: {str(e)}")
            # Don't fail the request if progress saving fails
    
    return ValidationResponse(
        is_correct=is_correct,
        feedback=feedback,
        table_data=table_data
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
