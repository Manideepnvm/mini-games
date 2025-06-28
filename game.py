# game.py
"""
Simplified Tic Tac Toe Game compatible with main.py
"""

import pygame
import sys
from typing import Optional, Tuple
from board import Board
from player import Player
from win_check import Win_check
from constants import *

class Game:
    """Simplified Tic Tac Toe Game"""
    
    def __init__(self, screen: pygame.Surface):
        self.screen = screen
        
        # Game components
        self.board = Board(screen)
        self.player = Player()
        self.win_checker = Win_check()
        
        # Game state
        self.winner = None
        self.win_positions = []
        self.game_over = False
        self.game_message = ""
        
        # Statistics
        self.score = {PLAYER_X: 0, PLAYER_O: 0}
        
        # Fonts
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)
        
        # Initialize
        self.reset_game()
    
    def reset_game(self):
        """Reset the game to initial state"""
        self.board.reset_board()
        self.player.reset()
        self.winner = None
        self.win_positions = []
        self.game_over = False
        
        current_player = self.player.get_current_player()
        self.game_message = f"Player {PLAYER_SYMBOLS[current_player]}'s turn"
    
    def handle_click(self, pos: Tuple[int, int]):
        """Handle mouse clicks"""
        if self.game_over:
            return
        
        square_pos = self.board.get_square_from_pos(pos)
        if not square_pos:
            return
        
        row, col = square_pos
        current_player = self.player.get_current_player()
        
        # Attempt to make move
        if self.board.mark_square(row, col, current_player):
            self._process_move(row, col, current_player)
    
    def _process_move(self, row: int, col: int, player: int):
        """Process a player's move and check game state"""
        # Check for win
        win_result = self.win_checker.check_win(self.board.get_board_state(), player)
        if win_result:
            self._handle_win(player, win_result)
            return
        
        # Check for draw
        if self.win_checker.is_draw(self.board.get_board_state()):
            self._handle_draw()
            return
        
        # Continue game
        self.player.switch_player()
        current_player = self.player.get_current_player()
        self.game_message = f"Player {PLAYER_SYMBOLS[current_player]}'s turn"
    
    def _handle_win(self, winner: int, win_positions):
        """Handle game win"""
        self.winner = winner
        self.win_positions = win_positions
        self.game_over = True
        
        # Update score
        self.score[winner] += 1
        
        # Set message
        winner_symbol = PLAYER_SYMBOLS[winner]
        self.game_message = f"Player {winner_symbol} Wins!"
        
        # Draw win line
        self.board.draw_win_line(win_positions)
    
    def _handle_draw(self):
        """Handle game draw"""
        self.game_over = True
        self.game_message = "It's a Draw!"
    
    def update(self):
        """Update game state"""
        # Update board animations
        self.board.update_animations(1/60)  # Assuming 60 FPS
    
    def draw(self):
        """Draw the game"""
        # Clear screen
        self.screen.fill(BG_COLOR)
        
        # Draw game board
        self.board.draw_board()
        
        # Draw symbols
        self.board.draw_symbols()
        
        # Draw win line if applicable
        if self.win_positions:
            self.board.draw_win_line(self.win_positions)
        
        # Draw UI
        self._draw_ui()
    
    def _draw_ui(self):
        """Draw game UI"""
        # Draw current player info
        self._draw_player_info()
        
        # Draw score
        self._draw_score()
        
        # Draw game message
        self._draw_message()
        
        # Draw instructions
        self._draw_instructions()
    
    def _draw_player_info(self):
        """Draw current player information"""
        if not self.game_over:
            current_player = self.player.get_current_player()
            player_text = f"Current: {PLAYER_SYMBOLS[current_player]}"
            color = PLAYER_COLORS[current_player]
        else:
            player_text = "Game Over"
            color = TEXT_COLOR
        
        text_surface = self.font.render(player_text, True, color)
        self.screen.blit(text_surface, (INFO_PANEL_X, INFO_PANEL_Y))
    
    def _draw_score(self):
        """Draw score"""
        score_text = f"Score: X={self.score[PLAYER_X]} O={self.score[PLAYER_O]}"
        text_surface = self.small_font.render(score_text, True, TEXT_COLOR)
        self.screen.blit(text_surface, (INFO_PANEL_X, INFO_PANEL_Y + 40))
    
    def _draw_message(self):
        """Draw game message"""
        if self.game_message:
            # Choose color based on game state
            if self.winner:
                color = SUCCESS_COLOR
            elif self.game_over:
                color = WARNING_COLOR
            else:
                color = INFO_COLOR
            
            text_surface = self.font.render(self.game_message, True, color)
            text_rect = text_surface.get_rect(center=(SCREEN_WIDTH // 2, 50))
            self.screen.blit(text_surface, text_rect)
    
    def _draw_instructions(self):
        """Draw control instructions"""
        instructions = [
            "Click to place symbol",
            "R - Reset game",
            "M - Return to menu",
            "ESC - Exit to menu"
        ]
        
        y_offset = SCREEN_HEIGHT - 120
        for instruction in instructions:
            text = self.small_font.render(instruction, True, INSTRUCTION_COLOR)
            self.screen.blit(text, (20, y_offset))
            y_offset += 20