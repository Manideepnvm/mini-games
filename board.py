# board.py
"""
Game board management for Tic Tac Toe
Handles board state, drawing, and animations
"""

import pygame
import math
import time
from typing import List, Tuple, Optional
from constants import *

class Board:
    """Game board manager with visual effects and animations"""
    
    def __init__(self, screen: pygame.Surface):
        self.screen = screen
        self.board_state = [[EMPTY_CELL for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        
        # Animation properties
        self.symbol_animations = {}
        self.hover_animation = 0
        self.win_line_animation = 0
        self.win_line_positions = []
        
        # Calculate board dimensions
        self.cell_size = GAME_BOARD_SIZE // BOARD_SIZE
        self.board_x = BOARD_OFFSET_X
        self.board_y = BOARD_OFFSET_Y
        
        # Visual effects
        self.glow_intensity = 0
        self.last_update = time.time()
    
    def reset_board(self):
        """Reset the board to empty state"""
        self.board_state = [[EMPTY_CELL for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        self.symbol_animations.clear()
        self.win_line_animation = 0
        self.win_line_positions = []
    
    def get_board_state(self) -> List[List[int]]:
        """Get current board state"""
        return [row[:] for row in self.board_state]  # Return copy
    
    def mark_square(self, row: int, col: int, player: int) -> bool:
        """
        Mark a square on the board
        
        Args:
            row: Row index (0-2)
            col: Column index (0-2)
            player: Player making the move
            
        Returns:
            True if move was successful, False if square already occupied
        """
        if not self.is_valid_position(row, col):
            return False
        
        if self.board_state[row][col] == EMPTY_CELL:
            self.board_state[row][col] = player
            # Start animation for this symbol
            self.symbol_animations[(row, col)] = {
                'scale': 0.0,
                'alpha': 0,
                'rotation': 0
            }
            return True
        return False
    
    def is_valid_position(self, row: int, col: int) -> bool:
        """Check if position is valid"""
        return 0 <= row < BOARD_SIZE and 0 <= col < BOARD_SIZE
    
    def get_square_from_pos(self, pos: Tuple[int, int]) -> Optional[Tuple[int, int]]:
        """
        Get board square from mouse position
        
        Args:
            pos: Mouse position (x, y)
            
        Returns:
            Tuple of (row, col) if position is on board, None otherwise
        """
        x, y = pos
        
        # Check if position is within board bounds
        if (self.board_x <= x <= self.board_x + GAME_BOARD_SIZE and
            self.board_y <= y <= self.board_y + GAME_BOARD_SIZE):
            
            col = (x - self.board_x) // self.cell_size
            row = (y - self.board_y) // self.cell_size
            
            if self.is_valid_position(row, col):
                return (row, col)
        
        return None
    
    def update_animations(self, dt: float):
        """Update all board animations"""
        current_time = time.time()
        
        # Update symbol animations
        for pos, anim in list(self.symbol_animations.items()):
            if anim['scale'] < 1.0:
                anim['scale'] = min(1.0, anim['scale'] + dt * 8)
                anim['alpha'] = min(255, anim['alpha'] + dt * 500)
                anim['rotation'] += dt * 720  # Full rotation in 0.5 seconds
        
        # Update hover animation
        self.hover_animation += dt * 4
        
        # Update glow effect
        self.glow_intensity = (math.sin(current_time * 3) + 1) * 0.5
        
        self.last_update = current_time
    
    def draw_board(self):
        """Draw the game board with grid lines"""
        # Draw board background
        board_rect = pygame.Rect(self.board_x, self.board_y, GAME_BOARD_SIZE, GAME_BOARD_SIZE)
        pygame.draw.rect(self.screen, BOARD_COLOR, board_rect)
        pygame.draw.rect(self.screen, BOARD_BORDER_COLOR, board_rect, BOARD_BORDER_WIDTH)
        
        # Draw grid lines
        for i in range(1, BOARD_SIZE):
            # Vertical lines
            x = self.board_x + i * self.cell_size
            pygame.draw.line(self.screen, GRID_COLOR, 
                           (x, self.board_y), 
                           (x, self.board_y + GAME_BOARD_SIZE), 
                           GRID_WIDTH)
            
            # Horizontal lines
            y = self.board_y + i * self.cell_size
            pygame.draw.line(self.screen, GRID_COLOR, 
                           (self.board_x, y), 
                           (self.board_x + GAME_BOARD_SIZE, y), 
                           GRID_WIDTH)
    
    def draw_symbols(self):
        """Draw X and O symbols on the board"""
        for row in range(BOARD_SIZE):
            for col in range(BOARD_SIZE):
                if self.board_state[row][col] != EMPTY_CELL:
                    self._draw_symbol(row, col, self.board_state[row][col])
    
    def _draw_symbol(self, row: int, col: int, player: int):
        """Draw a single symbol with animation"""
        center_x = self.board_x + col * self.cell_size + self.cell_size // 2
        center_y = self.board_y + row * self.cell_size + self.cell_size // 2
        
        # Get animation properties
        anim = self.symbol_animations.get((row, col), {'scale': 1.0, 'alpha': 255, 'rotation': 0})
        
        # Calculate symbol size
        base_size = min(self.cell_size - SYMBOL_PADDING * 2, MAX_SYMBOL_SIZE)
        symbol_size = int(base_size * anim['scale'])
        
        if symbol_size <= 0:
            return
        
        # Get symbol color
        color = PLAYER_COLORS[player]
        
        if player == PLAYER_X:
            self._draw_x(center_x, center_y, symbol_size, color, anim['alpha'])
        else:  # PLAYER_O
            self._draw_o(center_x, center_y, symbol_size, color, anim['alpha'])
    
    def _draw_x(self, center_x: int, center_y: int, size: int, color: Tuple[int, int, int], alpha: int):
        """Draw an X symbol"""
        half_size = size // 2
        thickness = max(SYMBOL_THICKNESS, size // 10)
        
        # Create surface for alpha blending
        x_surface = pygame.Surface((size + thickness, size + thickness), pygame.SRCALPHA)
        
        # Draw X lines
        pygame.draw.line(x_surface, (*color, alpha),
                        (thickness//2, thickness//2),
                        (size + thickness//2, size + thickness//2), thickness)
        pygame.draw.line(x_surface, (*color, alpha),
                        (thickness//2, size + thickness//2),
                        (size + thickness//2, thickness//2), thickness)
        
        # Blit to screen
        x_rect = x_surface.get_rect(center=(center_x, center_y))
        self.screen.blit(x_surface, x_rect)
    
    def _draw_o(self, center_x: int, center_y: int, size: int, color: Tuple[int, int, int], alpha: int):
        """Draw an O symbol"""
        radius = size // 2
        thickness = max(SYMBOL_THICKNESS, size // 10)
        
        # Create surface for alpha blending
        o_surface = pygame.Surface((size + thickness, size + thickness), pygame.SRCALPHA)
        
        # Draw O circle
        pygame.draw.circle(o_surface, (*color, alpha),
                          (size // 2 + thickness // 2, size // 2 + thickness // 2),
                          radius, thickness)
        
        # Blit to screen
        o_rect = o_surface.get_rect(center=(center_x, center_y))
        self.screen.blit(o_surface, o_rect)
    
    def draw_hover_effect(self, row: int, col: int):
        """Draw hover effect for a square"""
        if self.board_state[row][col] != EMPTY_CELL:
            return
        
        center_x = self.board_x + col * self.cell_size + self.cell_size // 2
        center_y = self.board_y + row * self.cell_size + self.cell_size // 2
        
        # Animated hover effect
        hover_size = int(20 + 5 * math.sin(self.hover_animation))
        hover_alpha = int(50 + 25 * math.sin(self.hover_animation * 2))
        
        # Create hover surface
        hover_surface = pygame.Surface((hover_size * 2, hover_size * 2), pygame.SRCALPHA)
        pygame.draw.circle(hover_surface, (*HOVER_COLOR, hover_alpha),
                          (hover_size, hover_size), hover_size)
        
        # Blit to screen
        hover_rect = hover_surface.get_rect(center=(center_x, center_y))
        self.screen.blit(hover_surface, hover_rect)
    
    def draw_win_line(self, win_positions: List[Tuple[int, int]]):
        """Draw winning line animation"""
        if not win_positions or len(win_positions) < 2:
            return
        
        self.win_line_positions = win_positions
        
        # Calculate line endpoints
        start_pos = win_positions[0]
        end_pos = win_positions[-1]
        
        start_x = self.board_x + start_pos[1] * self.cell_size + self.cell_size // 2
        start_y = self.board_y + start_pos[0] * self.cell_size + self.cell_size // 2
        end_x = self.board_x + end_pos[1] * self.cell_size + self.cell_size // 2
        end_y = self.board_y + end_pos[0] * self.cell_size + self.cell_size // 2
        
        # Animate line drawing
        self.win_line_animation = min(1.0, self.win_line_animation + 0.05)
        
        # Calculate current line end point
        current_end_x = start_x + (end_x - start_x) * self.win_line_animation
        current_end_y = start_y + (end_y - start_y) * self.win_line_animation
        
        # Draw win line with glow effect
        line_thickness = WIN_LINE_THICKNESS
        glow_color = (*WIN_LINE_COLOR, int(128 * self.glow_intensity))
        
        # Draw glow
        for i in range(5):
            thickness = line_thickness + i * 2
            alpha = max(20, int(60 - i * 10))
            
            # Create glow surface
            glow_surface = pygame.Surface((GAME_BOARD_SIZE + 20, GAME_BOARD_SIZE + 20), pygame.SRCALPHA)
            pygame.draw.line(glow_surface, (*WIN_LINE_COLOR, alpha),
                           (start_x - self.board_x + 10, start_y - self.board_y + 10),
                           (current_end_x - self.board_x + 10, current_end_y - self.board_y + 10),
                           thickness)
            
            self.screen.blit(glow_surface, (self.board_x - 10, self.board_y - 10),
                           special_flags=pygame.BLEND_ADD)
        
        # Draw main line
        pygame.draw.line(self.screen, WIN_LINE_COLOR,
                        (start_x, start_y), (current_end_x, current_end_y),
                        line_thickness)