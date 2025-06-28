# main.py
"""
Main entry point for Tic Tac Toe Professional Edition
"""

import pygame
import sys
from menu import Menu
from game import Game
from constants import *

def main():
    """Main game loop"""
    try:
        pygame.init()
        
        # Set up display
        screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption(GAME_TITLE)
        
        # Set up game clock
        clock = pygame.time.Clock()
        
        # Initialize game states
        menu = Menu(screen)
        game = Game(screen)
        
        # Game state management
        current_state = 'menu'
        running = True
        
        print(f"🎮 {GAME_TITLE} v{GAME_VERSION} Started!")
        print("📋 Controls:")
        print("   ESC - Back to menu / Quit")
        print("   R - Reset game")
        print("   M - Return to menu")
        print("   ENTER/SPACE - Start game from menu")
        
        while running:
            # Handle events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                
                elif event.type == pygame.KEYDOWN:
                    # ESC key handling
                    if event.key == pygame.K_ESCAPE:
                        if current_state == 'game':
                            current_state = 'menu'
                            game.reset_game()
                            print("🔙 Returned to menu")
                        else:
                            running = False
                    
                    # Menu controls
                    elif current_state == 'menu':
                        if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                            current_state = 'game'
                            game.reset_game()
                            print("🎯 Starting new game!")
                        elif event.key == pygame.K_q:
                            running = False
                    
                    # Game controls
                    elif current_state == 'game':
                        if event.key == pygame.K_r:
                            game.reset_game()
                            print("🔄 Game reset!")
                        elif event.key == pygame.K_m:
                            current_state = 'menu'
                            game.reset_game()
                            print("🔙 Returned to menu")
                
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 1:  # Left mouse button
                        if current_state == 'menu':
                            action = menu.handle_click(event.pos)
                            if action == 'start':
                                current_state = 'game'
                                game.reset_game()
                                print("🎯 Starting new game!")
                            elif action == 'quit':
                                print("👋 Thanks for playing!")
                                running = False
                        
                        elif current_state == 'game':
                            move_result = game.handle_click(event.pos)
                            if move_result:
                                print(f"🎯 Move played: {move_result}")
            
            # Update game states
            try:
                if current_state == 'menu':
                    menu.update()
                elif current_state == 'game':
                    game_status = game.update()
                    if game_status:
                        print(f"🎊 Game status: {game_status}")
            except Exception as e:
                print(f"❌ Error during update: {e}")
                current_state = 'menu'
            
            # Clear screen
            screen.fill(BACKGROUND_COLOR)
            
            # Draw current state
            try:
                if current_state == 'menu':
                    menu.draw()
                elif current_state == 'game':
                    game.draw()
            except Exception as e:
                print(f"❌ Error during drawing: {e}")
                # Draw error message
                font = pygame.font.Font(None, 36)
                error_text = font.render("Error occurred - Press ESC", True, (255, 255, 255))
                screen.blit(error_text, (SCREEN_WIDTH//2 - error_text.get_width()//2, SCREEN_HEIGHT//2))
            
            # Update display
            pygame.display.flip()
            clock.tick(FPS)
    
    except Exception as e:
        print(f"❌ Critical error: {e}")
        print("🔧 Please check your game files and try again")
    
    finally:
        # Cleanup
        print("🧹 Cleaning up...")
        pygame.quit()
        sys.exit()

def check_dependencies():
    """Check if all required modules are available"""
    try:
        import pygame
        print(f"✅ Pygame version: {pygame.version.ver}")
    except ImportError:
        print("❌ Pygame not installed. Run: pip install pygame")
        return False
    
    try:
        from constants import SCREEN_WIDTH, SCREEN_HEIGHT, GAME_TITLE, GAME_VERSION, FPS, BACKGROUND_COLOR
        print("✅ Constants loaded successfully")
    except ImportError as e:
        print(f"❌ Missing constants: {e}")
        return False
    
    try:
        from menu import Menu
        print("✅ Menu module loaded")
    except ImportError as e:
        print(f"❌ Menu module error: {e}")
        return False
    
    try:
        from game import Game
        print("✅ Game module loaded")
    except ImportError as e:
        print(f"❌ Game module error: {e}")
        return False
    
    return True


def __init__(self, screen):
    self.screen = screen

if __name__ == "__main__":
    print("🚀 Initializing Tic Tac Toe Professional Edition...")
    
    if check_dependencies():
        print("✅ All dependencies loaded successfully!")
        print("🎮 Starting main game loop...")
        try:
            main()
        except Exception as e:
            print(f"❌ Error in main(): {e}")
            import traceback
            traceback.print_exc()
    else:
        print("❌ Dependency check failed. Please fix the issues above.")
        sys.exit(1)