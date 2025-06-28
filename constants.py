# constants.py
"""
Professional Tic Tac Toe Game Constants
Contains all game configuration, colors, dimensions, and styling constants
"""

import pygame

# =================== SCREEN DIMENSIONS ===================
WIDTH = 800
HEIGHT = 600
GAME_BOARD_SIZE = 450  # Square game board size
BOARD_OFFSET_X = (WIDTH - GAME_BOARD_SIZE) // 2
BOARD_OFFSET_Y = (HEIGHT - GAME_BOARD_SIZE) // 2 + 20


BOARD_SIZE = 3  # or whatever size you want
EMPTY_CELL = ' '  # or 0, or None
PLAYER_X = 'X'
PLAYER_O = 'O'

# =================== GRID CONFIGURATION ===================
GRID_ROWS = 3
GRID_COLS = 3
SQUARE_SIZE = GAME_BOARD_SIZE // 3  # 150px per square
LINE_WIDTH = 8
GRID_LINE_WIDTH = 4



SCREEN_WIDTH = 600
SCREEN_HEIGHT = 600

# =================== SYMBOL DIMENSIONS ===================
# Circle (O) settings
CIRCLE_RADIUS = SQUARE_SIZE // 3  # 50px radius
CIRCLE_WIDTH = 12
CIRCLE_MARGIN = 25

# Cross (X) settings  
CROSS_WIDTH = 15
CROSS_MARGIN = 30
SPACE = SQUARE_SIZE // 4

# =================== ANIMATION SETTINGS ===================
ANIMATION_SPEED = 8
SYMBOL_FADE_SPEED = 5
HOVER_ANIMATION_SPEED = 10
WIN_LINE_ANIMATION_SPEED = 12
BUTTON_HOVER_SPEED = 6

# Animation delays (in milliseconds)
SYMBOL_DRAW_DELAY = 200
WIN_CELEBRATION_DELAY = 500
GAME_RESET_DELAY = 2000

# =================== COLOR PALETTE ===================
# Dark theme professional colors
BG_COLOR = (25, 25, 35)              # Dark navy background
MENU_BG_COLOR = (20, 20, 28)         # Darker menu background
GAME_BG_COLOR = (30, 30, 40)         # Game area background

# Grid and lines
LINE_COLOR = (70, 80, 100)           # Subtle gray-blue lines
GRID_COLOR = (50, 60, 80)            # Grid lines
BOARD_BORDER_COLOR = (80, 90, 110)   # Board border

# Game symbols
CROSS_COLOR = (255, 107, 107)        # Bright red for X
CIRCLE_COLOR = (107, 203, 255)       # Bright blue for O
SYMBOL_GLOW_COLOR = (255, 255, 255)  # White glow effect

# UI Colors
TEXT_COLOR = (245, 245, 255)         # Off-white text
ACCENT_COLOR = (138, 181, 255)       # Light blue accent
HIGHLIGHT_COLOR = (255, 215, 107)    # Gold highlight

# Button colors
BUTTON_COLOR = (60, 70, 90)          # Default button
BUTTON_HOVER_COLOR = (80, 90, 120)   # Hovered button  
BUTTON_ACTIVE_COLOR = (100, 110, 140) # Pressed button
BUTTON_TEXT_COLOR = (240, 240, 250)  # Button text

# Status colors
SUCCESS_COLOR = (107, 255, 140)      # Green for wins
WARNING_COLOR = (255, 193, 107)      # Orange for draws
ERROR_COLOR = (255, 107, 107)        # Red for errors
INFO_COLOR = (107, 181, 255)         # Blue for info

# Shadow and glow effects
SHADOW_COLOR = (10, 10, 15)          # Drop shadows
GLOW_COLOR = (255, 255, 255)         # Glow effects
OVERLAY_COLOR = (0, 0, 0)            # Semi-transparent overlays

# =================== GAME STATES ===================
EMPTY = 0
PLAYER_X = 1
PLAYER_O = 2

# Player symbols for display
PLAYER_SYMBOLS = {
    PLAYER_X: "X",
    PLAYER_O: "O",
    EMPTY: ""
}

# Player colors
PLAYER_COLORS = {
    PLAYER_X: CROSS_COLOR,
    PLAYER_O: CIRCLE_COLOR
}

# Player names
PLAYER_NAMES = {
    PLAYER_X: "Player X",
    PLAYER_O: "Player O"
}

# =================== FONT SETTINGS ===================
# Font sizes
TITLE_FONT_SIZE = 64
SUBTITLE_FONT_SIZE = 32
BUTTON_FONT_SIZE = 28
STATUS_FONT_SIZE = 24
SMALL_FONT_SIZE = 18
TINY_FONT_SIZE = 14

# Font weights (if custom fonts are used)
FONT_LIGHT = "light"
FONT_REGULAR = "regular"
FONT_BOLD = "bold"

# =================== SOUND SETTINGS ===================
# Volume levels (0.0 to 1.0)
MASTER_VOLUME = 0.7
SFX_VOLUME = 0.8
MUSIC_VOLUME = 0.5

# =================== GAME MECHANICS ===================
# Win conditions
WIN_CONDITIONS = [
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

# Game modes
GAME_MODE_PVP = "player_vs_player"
GAME_MODE_PVE = "player_vs_computer"
GAME_MODE_EVE = "computer_vs_computer"


# constants.py

# Screen dimensions
WIDTH = 800
HEIGHT = 600

# Colors (RGB values)
# Background and UI colors
BG_COLOR = (30, 35, 50)          # Dark blue-gray background
TEXT_COLOR = (255, 255, 255)     # White text
ACCENT_COLOR = (100, 200, 255)   # Light blue accent
SHADOW_COLOR = (10, 10, 15)      # Dark shadow

# Button colors
BUTTON_COLOR = (60, 70, 90)      # Default button color
BUTTON_HOVER_COLOR = (80, 90, 110)  # Button hover color

# Game board colors
BOARD_COLOR = (60, 70, 90)       # Board background color (lighter)
LINE_COLOR = (150, 160, 180)     # Grid lines color (much lighter)
GRID_COLOR = (150, 160, 180)     # Alternative name for grid lines
BOARD_LINE_COLOR = (200, 200, 200)  # Bright grid lines
CELL_BORDER_COLOR = (180, 180, 180)  # Cell border color

# Player colors
PLAYER_X_COLOR = (255, 120, 120)  # Bright red for X
PLAYER_O_COLOR = (120, 255, 120)  # Bright green for O
X_COLOR = (255, 100, 100)         # Alternative X color
O_COLOR = (100, 255, 100)         # Alternative O color

# Game colors
WINNING_LINE_COLOR = (255, 215, 0)  # Gold for winning line
HOVER_COLOR = (200, 200, 200)       # Light gray for hover effects

# UI Text colors
INSTRUCTION_COLOR = (180, 180, 180)  # Light gray for instructions
STATUS_COLOR = (255, 255, 255)      # White for status text
TITLE_COLOR = (255, 255, 255)       # White for titles
SUBTITLE_COLOR = (100, 200, 255)    # Light blue for subtitles
ERROR_COLOR = (255, 100, 100)       # Red for error messages
SUCCESS_COLOR = (100, 255, 100)     # Green for success messages

# Board dimensions and styling
BOARD_SIZE = 450                 # Size of the game board
BOARD_BORDER_WIDTH = 5           # Width of board border
CELL_SIZE = BOARD_SIZE // 3      # Size of each cell (150px)
GRID_WIDTH = 4                   # Width of grid lines (increased)
LINE_WIDTH = 4                   # Alternative line width
SYMBOL_WIDTH = 8                 # Width of X and O symbols
SYMBOL_MARGIN = 50               # Margin around symbols
SYMBOL_PADDING = 20              # Padding inside cells for symbols
SYMBOL_THICKNESS = 8             # Thickness of symbol lines (increased)
MAX_SYMBOL_SIZE = CELL_SIZE - (SYMBOL_PADDING * 2)  # Maximum size for symbols (110px)

# Board positioning (centered on screen)
BOARD_X = (WIDTH - BOARD_SIZE) // 2
BOARD_Y = (HEIGHT - BOARD_SIZE) // 2

# Animation settings
ANIMATION_SPEED = 5              # Speed of animations
FADE_SPEED = 3                   # Speed of fade effects

# Alternative common color names
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
GRAY = (128, 128, 128)
LIGHT_GRAY = (200, 200, 200)
DARK_GRAY = (64, 64, 64)

# AI Difficulty levels
AI_EASY = "easy"
AI_MEDIUM = "medium" 
AI_HARD = "hard"
AI_IMPOSSIBLE = "impossible"

# =================== UI LAYOUT ===================
# Header area
HEADER_HEIGHT = 80
HEADER_Y = 20

# Game info panel
INFO_PANEL_WIDTH = 200
INFO_PANEL_HEIGHT = 300
INFO_PANEL_X = WIDTH - INFO_PANEL_WIDTH - 20
INFO_PANEL_Y = HEADER_HEIGHT + 40

# Control buttons
BUTTON_WIDTH = 120
BUTTON_HEIGHT = 40
BUTTON_MARGIN = 10

# Status display
STATUS_AREA_HEIGHT = 60
STATUS_Y = HEIGHT - STATUS_AREA_HEIGHT - 20

# =================== EFFECTS & PARTICLES ===================
# Particle system
MAX_PARTICLES = 100
PARTICLE_LIFETIME = 60  # frames
PARTICLE_SPEED_RANGE = (1, 4)
PARTICLE_SIZE_RANGE = (1, 4)

# Win celebration effects  
CONFETTI_PARTICLES = 50
CONFETTI_COLORS = [
    (255, 107, 107),  # Red
    (107, 203, 255),  # Blue  
    (107, 255, 140),  # Green
    (255, 215, 107),  # Gold
    (255, 107, 255),  # Magenta
    (107, 255, 255),  # Cyan
]

# Hover effects
HOVER_SCALE_FACTOR = 1.05
HOVER_GLOW_RADIUS = 10
HOVER_PULSE_SPEED = 0.1

# =================== PERFORMANCE SETTINGS ===================
TARGET_FPS = 60
MAX_FRAME_TIME = 1000 // TARGET_FPS  # 16.67ms for 60 FPS

# Rendering optimizations
VSYNC_ENABLED = True
HARDWARE_ACCELERATION = True

# =================== DEBUG SETTINGS ===================
DEBUG_MODE = False
SHOW_FPS = False
SHOW_GRID_COORDINATES = False
SHOW_COLLISION_BOXES = False

# Debug colors
DEBUG_COLOR = (255, 0, 255)  # Magenta for debug elements
FPS_COLOR = (255, 255, 0)    # Yellow for FPS counter

# =================== FILE PATHS ===================
# Asset directories (if used in future)
ASSETS_DIR = "assets/"
IMAGES_DIR = ASSETS_DIR + "images/"
SOUNDS_DIR = ASSETS_DIR + "sounds/"
FONTS_DIR = ASSETS_DIR + "fonts/"


FPS = 60
BACKGROUND_COLOR = (20, 25, 40)

# =================== UTILITY FUNCTIONS ===================
def get_square_center(row, col):
    """Get the center coordinates of a grid square"""
    x = BOARD_OFFSET_X + col * SQUARE_SIZE + SQUARE_SIZE // 2
    y = BOARD_OFFSET_Y + row * SQUARE_SIZE + SQUARE_SIZE // 2
    return (x, y)

def get_square_rect(row, col):
    """Get the rectangle bounds of a grid square"""
    x = BOARD_OFFSET_X + col * SQUARE_SIZE
    y = BOARD_OFFSET_Y + row * SQUARE_SIZE
    return pygame.Rect(x, y, SQUARE_SIZE, SQUARE_SIZE)

def get_board_rect():
    """Get the rectangle bounds of the entire game board"""
    return pygame.Rect(BOARD_OFFSET_X, BOARD_OFFSET_Y, GAME_BOARD_SIZE, GAME_BOARD_SIZE)

# =================== VERSION INFO ===================
GAME_VERSION = "2.0.0"
GAME_TITLE = "Professional Tic Tac Toe"
DEVELOPER = "Game Developer"
RELEASE_DATE = "2025"