# menu.py
import pygame
import sys
import math
from constants import (
    WIDTH, HEIGHT, BG_COLOR, TEXT_COLOR, ACCENT_COLOR, 
    BUTTON_COLOR, BUTTON_HOVER_COLOR, SHADOW_COLOR
)

class Menu:
    def __init__(self, screen):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Tic Tac Toe - Professional Edition")
        
        # Fonts
        self.title_font = pygame.font.Font(None, 72)
        self.subtitle_font = pygame.font.Font(None, 36)
        self.button_font = pygame.font.Font(None, 32)
        self.small_font = pygame.font.Font(None, 24)
        
        # Animation variables
        self.animation_time = 0
        self.title_bounce = 0
        self.glow_alpha = 0
        self.glow_direction = 1
        
        # Button states
        self.play_button_rect = pygame.Rect(WIDTH//2 - 100, HEIGHT//2 - 25, 200, 50)
        self.quit_button_rect = pygame.Rect(WIDTH//2 - 100, HEIGHT//2 + 40, 200, 50)
        self.play_button_hovered = False
        self.quit_button_hovered = False
        
        # Background particles
        self.particles = []
        self.init_particles()
        
        self.running = True
        self.clock = pygame.time.Clock()

    def update(self):
        """Update menu state - called every frame"""
        pass  # You can add hover effects here later

    def draw(self):
        """Draw the menu on screen"""
        # Fill background
        self.screen.fill((30, 35, 50))  # Dark background
        
        # Create font if not exists
        try:
            font_large = pygame.font.Font(None, 48)
            font_medium = pygame.font.Font(None, 36)
        except:
            font_large = pygame.font.Font(None, 48)
            font_medium = pygame.font.Font(None, 36)
        
        # Draw title
        title_text = font_large.render("TIC TAC TOE", True, (255, 255, 255))
        title_rect = title_text.get_rect(center=(self.screen.get_width()//2, 150))
        self.screen.blit(title_text, title_rect)
        
        # Draw start instruction
        start_text = font_medium.render("Press ENTER or SPACE to Start", True, (255, 255, 255))
        start_rect = start_text.get_rect(center=(self.screen.get_width()//2, 300))
        self.screen.blit(start_text, start_rect)
        
        # Draw quit instruction
        quit_text = font_medium.render("Press ESC to Quit", True, (255, 255, 255))
        quit_rect = quit_text.get_rect(center=(self.screen.get_width()//2, 350))
        self.screen.blit(quit_text, quit_rect)

    def handle_click(self, pos):
        """Handle mouse clicks - returns action or None"""
        # For now, just return None (no mouse actions)
        # You can add clickable buttons here later
        return None

    def init_particles(self):
        """Initialize background particles for visual effect"""
        import random
        for _ in range(50):
            particle = {
                'x': random.randint(0, WIDTH),
                'y': random.randint(0, HEIGHT),
                'dx': random.uniform(-0.5, 0.5),
                'dy': random.uniform(-0.5, 0.5),
                'size': random.randint(1, 3),
                'alpha': random.randint(30, 100)
            }
            self.particles.append(particle)

    def update_particles(self):
        """Update particle positions and wrap around screen"""
        for particle in self.particles:
            particle['x'] += particle['dx']
            particle['y'] += particle['dy']
            
            # Wrap around screen
            if particle['x'] < 0:
                particle['x'] = WIDTH
            elif particle['x'] > WIDTH:
                particle['x'] = 0
            if particle['y'] < 0:
                particle['y'] = HEIGHT
            elif particle['y'] > HEIGHT:
                particle['y'] = 0

    def draw_particles(self):
        """Draw floating particles in background"""
        for particle in self.particles:
            # Create surface for alpha blending
            particle_surf = pygame.Surface((particle['size'] * 2, particle['size'] * 2))
            particle_surf.set_alpha(particle['alpha'])
            pygame.draw.circle(particle_surf, ACCENT_COLOR, 
                             (particle['size'], particle['size']), particle['size'])
            self.screen.blit(particle_surf, (particle['x'] - particle['size'], 
                                           particle['y'] - particle['size']))

    def draw_gradient_background(self):
        """Draw a subtle gradient background"""
        for y in range(HEIGHT):
            # Create gradient from dark to slightly lighter
            color_value = int(20 + (y / HEIGHT) * 15)
            color = (color_value, color_value, color_value + 5)
            pygame.draw.line(self.screen, color, (0, y), (WIDTH, y))

    def draw_animated_title(self):
        """Draw the main title with animation effects"""
        # Calculate bounce effect
        self.title_bounce = math.sin(self.animation_time * 0.05) * 5
        
        # Draw title shadow
        title_shadow = self.title_font.render("TIC TAC TOE", True, SHADOW_COLOR)
        shadow_rect = title_shadow.get_rect(center=(WIDTH//2 + 3, HEIGHT//4 + 3 + self.title_bounce))
        self.screen.blit(title_shadow, shadow_rect)
        
        # Draw main title
        title_text = self.title_font.render("TIC TAC TOE", True, TEXT_COLOR)
        title_rect = title_text.get_rect(center=(WIDTH//2, HEIGHT//4 + self.title_bounce))
        self.screen.blit(title_text, title_rect)
        
        # Draw glowing effect
        self.glow_alpha += self.glow_direction * 2
        if self.glow_alpha >= 100:
            self.glow_direction = -1
        elif self.glow_alpha <= 20:
            self.glow_direction = 1
            
        glow_surf = pygame.Surface((title_rect.width + 20, title_rect.height + 20))
        glow_surf.set_alpha(self.glow_alpha)
        glow_surf.fill(ACCENT_COLOR)
        self.screen.blit(glow_surf, (title_rect.x - 10, title_rect.y - 10), special_flags=pygame.BLEND_ADD)

    def draw_subtitle(self):
        """Draw subtitle text"""
        subtitle_text = self.subtitle_font.render("Professional Edition", True, ACCENT_COLOR)
        subtitle_rect = subtitle_text.get_rect(center=(WIDTH//2, HEIGHT//4 + 60))
        self.screen.blit(subtitle_text, subtitle_rect)

    def draw_button(self, rect, text, hovered, font):
        """Draw a modern button with hover effects"""
        # Button color based on hover state
        button_color = BUTTON_HOVER_COLOR if hovered else BUTTON_COLOR
        
        # Draw button shadow
        shadow_rect = rect.copy()
        shadow_rect.x += 2
        shadow_rect.y += 2
        pygame.draw.rect(self.screen, SHADOW_COLOR, shadow_rect, border_radius=10)
        
        # Draw main button
        pygame.draw.rect(self.screen, button_color, rect, border_radius=10)
        
        # Draw button border
        border_color = ACCENT_COLOR if hovered else TEXT_COLOR
        pygame.draw.rect(self.screen, border_color, rect, 2, border_radius=10)
        
        # Draw button text
        text_color = TEXT_COLOR if not hovered else BG_COLOR
        button_text = font.render(text, True, text_color)
        text_rect = button_text.get_rect(center=rect.center)
        self.screen.blit(button_text, text_rect)
        
        # Hover glow effect
        if hovered:
            glow_surf = pygame.Surface((rect.width + 10, rect.height + 10))
            glow_surf.set_alpha(30)
            glow_surf.fill(ACCENT_COLOR)
            self.screen.blit(glow_surf, (rect.x - 5, rect.y - 5), special_flags=pygame.BLEND_ADD)

    def draw_decorative_elements(self):
        """Draw decorative X and O symbols"""
        # Draw decorative X
        x_size = 30
        x_pos = (WIDTH//4, HEIGHT//2 - 50)
        pygame.draw.line(self.screen, ACCENT_COLOR, 
                        (x_pos[0] - x_size//2, x_pos[1] - x_size//2),
                        (x_pos[0] + x_size//2, x_pos[1] + x_size//2), 4)
        pygame.draw.line(self.screen, ACCENT_COLOR,
                        (x_pos[0] + x_size//2, x_pos[1] - x_size//2),
                        (x_pos[0] - x_size//2, x_pos[1] + x_size//2), 4)
        
        # Draw decorative O
        o_pos = (3*WIDTH//4, HEIGHT//2 - 50)
        pygame.draw.circle(self.screen, ACCENT_COLOR, o_pos, x_size//2, 4)

    def draw_footer(self):
        """Draw footer information"""
        footer_text = self.small_font.render("Use mouse to interact • ESC to quit", True, TEXT_COLOR)
        footer_rect = footer_text.get_rect(center=(WIDTH//2, HEIGHT - 30))
        self.screen.blit(footer_text, footer_rect)

    def handle_events(self):
        """Handle all menu events"""
        mouse_pos = pygame.mouse.get_pos()
        
        # Check button hover states
        self.play_button_hovered = self.play_button_rect.collidepoint(mouse_pos)
        self.quit_button_hovered = self.quit_button_rect.collidepoint(mouse_pos)
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                return "quit"
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                    return "quit"
                elif event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                    return "play"
            
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1:  # Left click
                    if self.play_button_rect.collidepoint(mouse_pos):
                        return "play"
                    elif self.quit_button_rect.collidepoint(mouse_pos):
                        self.running = False
                        return "quit"
        
        return None

    def run(self):
        """Main menu loop"""
        while self.running:
            dt = self.clock.tick(60)
            self.animation_time += dt
            
            # Handle events
            action = self.handle_events()
            if action == "play":
                self.running = False
                # Import here to avoid circular imports
                from game import Game
                game = Game()
                game.run()
                break
            elif action == "quit":
                break
            
            # Update animations
            self.update_particles()
            
            # Draw everything
            self.draw_gradient_background()
            self.draw_particles()
            self.draw_animated_title()
            self.draw_subtitle()
            self.draw_decorative_elements()
            
            # Draw buttons
            self.draw_button(self.play_button_rect, "PLAY GAME", self.play_button_hovered, self.button_font)
            self.draw_button(self.quit_button_rect, "QUIT", self.quit_button_hovered, self.button_font)
            
            self.draw_footer()
            
            pygame.display.flip()
        
        pygame.quit()
        sys.exit()