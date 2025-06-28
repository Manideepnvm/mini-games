# player.py
"""
Player management for Tic Tac Toe
Handles player turns and game state
"""

from constants import PLAYER_X, PLAYER_O

class Player:
    """Manages player turns and game state"""
    
    def __init__(self, starting_player: int = PLAYER_X):
        self.current_player = starting_player
        self.starting_player = starting_player
    
    def get_current_player(self) -> int:
        """Get the current player"""
        return self.current_player
    
    def switch_player(self):
        """Switch to the other player"""
        self.current_player = PLAYER_O if self.current_player == PLAYER_X else PLAYER_X
    
    def reset(self, starting_player: int = None):
        """Reset to starting player"""
        if starting_player is not None:
            self.starting_player = starting_player
        self.current_player = self.starting_player
    
    def get_other_player(self) -> int:
        """Get the other player (not current)"""
        return PLAYER_O if self.current_player == PLAYER_X else PLAYER_X