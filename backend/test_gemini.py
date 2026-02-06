#!/usr/bin/env python3
"""
Test script to verify Gemini API key and model are working
"""
import os
from dotenv import load_dotenv
from config import Config
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI

# Load environment variables
load_dotenv()

def test_gemini_direct():
    """Test Gemini using google.generativeai (for vision/camera)"""
    print("=" * 60)
    print("Testing Gemini API (Direct - google.generativeai)")
    print("=" * 60)
    
    api_key = Config.GEMINI_API_KEY
    
    if not api_key:
        print("ERROR: GEMINI_API_KEY is not set in environment variables")
        print("   Please set it in your .env file or environment")
        return False
    
    print(f"OK - API Key found: {api_key[:10]}...{api_key[-5:]}")
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Test with the model used in crop_disease_camera.py
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        # Simple text generation test
        print("\nTesting text generation...")
        response = model.generate_content("Say 'Hello' in one word")
        
        if response and response.text:
            print(f"OK - Response received: {response.text.strip()}")
            print("SUCCESS - Direct Gemini API test PASSED")
            return True
        else:
            print("ERROR - No response received")
            return False
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        if "API_KEY" in str(e) or "api key" in str(e).lower():
            print("   → Check if your API key is valid")
        elif "quota" in str(e).lower() or "limit" in str(e).lower():
            print("   → API quota exceeded or rate limited")
        elif "model" in str(e).lower():
            print("   → Model name might be incorrect or not available")
        return False

def test_gemini_langchain():
    """Test Gemini using langchain_google_genai (for agents)"""
    print("\n" + "=" * 60)
    print("Testing Gemini API (LangChain - ChatGoogleGenerativeAI)")
    print("=" * 60)
    
    api_key = Config.GEMINI_API_KEY
    
    if not api_key:
        print("ERROR: GEMINI_API_KEY is not set")
        return False
    
    try:
        # Test with the model used in langgraph_kisaan_agents.py
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-lite",
            temperature=0.01,
            google_api_key=api_key,
        )
        
        print("\nTesting text generation via LangChain...")
        from langchain_core.messages import HumanMessage
        
        messages = [HumanMessage(content="Say 'Hello' in one word")]
        response = llm.invoke(messages)
        
        if response and response.content:
            print(f"OK - Response received: {response.content.strip()}")
            print("SUCCESS - LangChain Gemini API test PASSED")
            return True
        else:
            print("ERROR - No response received")
            return False
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        if "API_KEY" in str(e) or "api key" in str(e).lower():
            print("   → Check if your API key is valid")
        elif "quota" in str(e).lower() or "limit" in str(e).lower():
            print("   → API quota exceeded or rate limited")
        elif "model" in str(e).lower():
            print("   → Model name might be incorrect or not available")
        return False

def main():
    print("\nGemini API Key & Model Test")
    print("=" * 60)
    
    # Check if .env file exists
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        print(f"OK - Found .env file at: {env_path}")
    else:
        print(f"WARNING - No .env file found at: {env_path}")
        print("   Make sure GEMINI_API_KEY is set in environment or .env file")
    
    print()
    
    # Test both methods
    test1 = test_gemini_direct()
    test2 = test_gemini_langchain()
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Direct API (google.generativeai): {'PASS' if test1 else 'FAIL'}")
    print(f"LangChain API (ChatGoogleGenerativeAI): {'PASS' if test2 else 'FAIL'}")
    
    if test1 and test2:
        print("\nSUCCESS - All tests passed! Your Gemini API key and model are working correctly.")
        return 0
    else:
        print("\nWARNING - Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())

