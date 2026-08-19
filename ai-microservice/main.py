import os
import aiomysql
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load Environment Variables
load_dotenv()

app = FastAPI()

# Allow your React frontend (port 5173 or your phone's IP) to talk to this Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Groq Model
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="qwen-3.6-27b",
    temperature=0.7
)

class ChatRequest(BaseModel):
    message: str
    user_name: str = "Guest"

# Async function to get the live menu from MySQL
async def get_live_menu():
    try:
        conn = await aiomysql.connect(
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            db=os.getenv("DB_NAME")
        )
        async with conn.cursor(aiomysql.DictCursor) as cur:
            await cur.execute("SELECT name, category, price, calories, protein FROM fooditems")
            menu = await cur.fetchall()
        conn.close()
        return menu
    except Exception as e:
        print(f"Database error: {e}")
        return []

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # 1. Fetch the live menu from your existing BroBite MySQL DB
    live_menu = await get_live_menu()
    
    # Format the menu so the AI can read it easily
    menu_string = "\n".join([f"- {item['name']} ({item['category']}): ₹{item['price']} | {item['calories']} cal | {item['protein']}g protein" for item in live_menu])

    # 2. Build the Highly Specific BroBite System Prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the official AI Nutritionist and Assistant for BroBite, a health-focused food delivery app.
        Your job is to recommend meals based on macros, answer questions about the menu, and be friendly and energetic.
        
        Here is our LIVE MENU straight from the database:
        {menu_string if menu_string else "The menu is currently unavailable."}
        
        Rules:
        1. Only recommend items that actually exist on the LIVE MENU above.
        2. If asked about prices, use the ₹ symbol.
        3. Keep responses concise, helpful, and matching a fitness/health vibe.
        """),
        ("human", "User ({user_name}) says: {message}")
    ])

    # 3. Create the LangChain processing chain
    chain = prompt | llm | StrOutputParser()

    try:
        # 4. Generate the response
        response = await chain.ainvoke({
            "message": request.message,
            "user_name": request.user_name
        })
        return {"reply": response}
    except Exception as e:
        print(f"🚨 THE EXACT BUG IS: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)