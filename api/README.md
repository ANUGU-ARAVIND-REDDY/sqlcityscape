
# SQL Validator API

This FastAPI service validates SQL queries against challenges and provides feedback using an AI model.

## Environment Variables

- `AI_ENDPOINT`: URL to the AI model validation endpoint
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

## Getting Started

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server locally:
   ```
   uvicorn main:app --reload
   ```

3. API will be available at http://localhost:8000

## API Documentation

FastAPI automatically generates interactive documentation at `/docs` endpoint.

## Docker

Build the Docker image:
```
docker build -t sql-validator-api .
```

Run the container:
```
docker run -p 8000:8000 -e AI_ENDPOINT=<url> -e SUPABASE_URL=<url> -e SUPABASE_SERVICE_KEY=<key> sql-validator-api
```
