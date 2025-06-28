# win_check.py
"""
Win condition checker for Tic Tac Toe
Handles all win detection logic and game state validation
"""

from typing import List, Tuple, Optional
from constants import BOARD_SIZE, EMPTY_CELL, PLAYER_X, PLAYER_O

class Win_check:
    """Handles win condition checking for Tic Tac Toe"""
    
    def __init__(self):
        self.winning_combinations = [
            # Rows
            [(0, 0), (0, 1), (0, 2)],
            [(1, 0), (1, 1), (1, 2)],
            [(2, 0), (2, 1), (2, 2)],
            # Columns
            [(0, 0), (1, 0), (2, 0)],
            [(0, 1), (1, 1), (2, 1)],
            [(0, 2), (1, 2), (2, 2)],
            # Diagonals
            [(0, 0), (1, 1), (2, 2)],
            [(0, 2), (1, 1), (2, 0)]
        ]
    
    def check_win(self, board_state: List[List[int]], player: int) -> Optional[List[Tuple[int, int]]]:
        """
        Check if the specified player has won
        
        Args:
            board_state: Current state of the game board
            player: Player to check for win (PLAYER_X or PLAYER_O)
            
        Returns:
            List of winning positions if player has won, None otherwise
        """
        for combination in self.winning_combinations:
            if all(board_state[row][col] == player for row, col in combination):
                return combination
        return None
    
    def is_draw(self, board_state: List[List[int]]) -> bool:
        """
        Check if the game is a draw (board full, no winner)
        
        Args:
            board_state: Current state of the game board
            
        Returns:
            True if game is a draw, False otherwise
        """
        # Check if board is full
        for row in board_state:
            if EMPTY_CELL in row:
                return False
        
        # Board is full, check if there's a winner
        if (self.check_win(board_state, PLAYER_X) is None and 
            self.check_win(board_state, PLAYER_O) is None):
            return True
        
        return False
    
    def is_game_over(self, board_state: List[List[int]]) -> bool:
        """
        Check if the game is over (win or draw)
        
        Args:
            board_state: Current state of the game board
            
        Returns:
            True if game is over, False otherwise
        """
        return (self.check_win(board_state, PLAYER_X) is not None or
                self.check_win(board_state, PLAYER_O) is not None or
                self.is_draw(board_state))
    
    def get_winner(self, board_state: List[List[int]]) -> Optional[int]:
        """
        Get the winner of the game
        
        Args:
            board_state: Current state of the game board
            
        Returns:
            Winner player (PLAYER_X or PLAYER_O) or None if no winner
        """
        if self.check_win(board_state, PLAYER_X):
            return PLAYER_X
        elif self.check_win(board_state, PLAYER_O):
            return PLAYER_O
        return None