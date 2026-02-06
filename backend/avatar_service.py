"""
AI Avatar Service for generating talking avatar videos
This service integrates with text-to-speech and provides avatar video generation
"""
import os
import logging
from typing import Dict, Optional
import base64
import asyncio

logger = logging.getLogger(__name__)

class AvatarService:
    """
    Service for managing AI avatar responses
    Currently uses audio-based avatar with animated overlay
    Can be extended to integrate with services like D-ID, HeyGen, or Synthesia
    """
    
    def __init__(self):
        self.avatar_enabled = True
        self.default_avatar_id = "farmer_avatar_1"
        
    async def generate_avatar_response(
        self,
        text: str,
        audio_base64: str,
        language: str = "hindi",
        avatar_id: Optional[str] = None
    ) -> Dict:
        """
        Generate avatar response with synchronized video and audio
        
        Args:
            text: Text content to speak
            audio_base64: Base64 encoded audio of the speech
            language: Language code
            avatar_id: Optional specific avatar ID
            
        Returns:
            Dict with avatar video URL, audio, and metadata
        """
        try:
            avatar_id = avatar_id or self.default_avatar_id
            
            # For now, we return audio-based avatar response
            # In production, this would call an avatar generation API
            response = {
                "success": True,
                "avatar_type": "animated",  # or "video" when using real avatar service
                "avatar_id": avatar_id,
                "audio_base64": audio_base64,
                "text": text,
                "language": language,
                "duration_ms": self._estimate_duration(text),
                "metadata": {
                    "has_video": False,  # Set to True when using real avatar service
                    "animation_type": "speaking",
                    "quality": "hd"
                }
            }
            
            logger.info(f"Generated avatar response for text length: {len(text)}")
            return response
            
        except Exception as e:
            logger.error(f"Avatar generation error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "fallback_audio": audio_base64
            }
    
    def _estimate_duration(self, text: str) -> int:
        """Estimate speech duration in milliseconds"""
        # Rough estimation: ~150 words per minute
        words = len(text.split())
        duration_seconds = (words / 150) * 60
        return int(duration_seconds * 1000)
    
    async def get_avatar_info(self, avatar_id: str) -> Dict:
        """Get information about a specific avatar"""
        avatars = {
            "farmer_avatar_1": {
                "id": "farmer_avatar_1",
                "name": "Kisan Avatar",
                "description": "Friendly Indian farmer avatar",
                "language_support": ["hindi", "english", "punjabi", "marathi"],
                "avatar_type": "animated"
            }
        }
        
        return avatars.get(avatar_id, avatars["farmer_avatar_1"])
    
    def extract_additional_info(self, agent_state: Dict) -> Optional[Dict]:
        """
        Extract additional information from agent state to display alongside avatar
        
        Args:
            agent_state: The final state from LangGraph agents
            
        Returns:
            Dict with additional info for display panel
        """
        try:
            # Check for fertilizer information
            fertilizer_info = agent_state.get("fertilizer_info", {})
            if fertilizer_info and not fertilizer_info.get("fallback"):
                images = agent_state.get("image_urls", [])
                return {
                    "type": "fertilizer",
                    "data": {
                        "recommendation": fertilizer_info.get("recommendation", ""),
                        "crop": fertilizer_info.get("crop", ""),
                        "stage": fertilizer_info.get("stage", ""),
                        "images": images[:4]  # Limit to 4 images
                    }
                }
            
            # Check for pesticide information
            pesticide_info = agent_state.get("pesticide_info", {})
            if pesticide_info and not pesticide_info.get("fallback"):
                images = agent_state.get("image_urls", [])
                return {
                    "type": "pesticide",
                    "data": {
                        "recommendation": pesticide_info.get("recommendation", ""),
                        "pest": pesticide_info.get("pest", ""),
                        "crop": pesticide_info.get("crop", ""),
                        "images": images[:4]  # Limit to 4 images
                    }
                }
            
            # Check for weather data
            if agent_state.get("weather_data") and agent_state["weather_data"]:
                return {
                    "type": "weather",
                    "data": agent_state["weather_data"]
                }
            
            # Check for market data
            if agent_state.get("market_data") and agent_state["market_data"]:
                market_info = []
                for item in agent_state["market_data"][:5]:  # Top 5 items
                    market_info.append({
                        "commodity": item.get("commodity", "Unknown"),
                        "price": item.get("modal_price", 0),
                        "market": item.get("market", "")
                    })
                return {
                    "type": "market_prices",
                    "data": market_info
                }
            
            # Check for government schemes
            if agent_state.get("government_schemes") and agent_state["government_schemes"]:
                return {
                    "type": "scheme_info",
                    "data": {
                        "info": "Government scheme information available",
                        "schemes": agent_state["government_schemes"]
                    }
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting additional info: {str(e)}")
            return None


# Global avatar service instance
avatar_service = AvatarService()



