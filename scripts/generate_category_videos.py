#!/usr/bin/env python3
"""
Generate professional, looping MP4 videos for all category badges with rich golden light,
sacred geometry, dynamic particles, and spiritual iconography.
"""
import os
import sys
import math
import shutil
import subprocess

OUTPUT_DIR = "public/videos/categories"
FPS = 30
DURATION = 2.0  # 2 seconds seamless loop
TOTAL_FRAMES = int(FPS * DURATION)
SIZE = 240  # 240x240 crisp badge resolution

os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_svg_defs():
    return """
    <defs>
      <radialGradient id="gold-radial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="25%" stop-color="#fef08a"/>
        <stop offset="55%" stop-color="#f59e0b"/>
        <stop offset="85%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#451a03"/>
      </radialGradient>
      <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="20%" stop-color="#fde047"/>
        <stop offset="45%" stop-color="#d97706"/>
        <stop offset="70%" stop-color="#fef08a"/>
        <stop offset="90%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
        <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.5"/>
        <stop offset="75%" stop-color="#d97706" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="glow-heavy" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    """

def render_frame_versets_protection(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    rot = t * 360.0
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#04130b"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.85"/>
      <!-- Rotating celestial rays -->
      <g transform="translate(120,120) rotate({rot})">
        <circle cx="0" cy="0" r="90" fill="none" stroke="#fde047" stroke-width="1.2" stroke-dasharray="4 8" opacity="0.6"/>
        <circle cx="0" cy="0" r="102" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 12" opacity="0.4"/>
      </g>
      <!-- Sacred Shield -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <path d="M120 38 L185 66 V128 C185 174 120 204 120 204 C120 204 55 174 55 128 V66 Z" 
              fill="url(#gold-metallic)" stroke="#fffbeb" stroke-width="3.5" filter="url(#soft-glow)"/>
        <path d="M120 48 L175 72 V126 C175 163 120 189 120 189 C120 189 65 163 65 126 V72 Z" 
              fill="#063821" opacity="0.95"/>
        <path d="M100 120 L115 135 L145 98" fill="none" stroke="url(#gold-metallic)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft-glow)"/>
        <circle cx="120" cy="74" r="5" fill="#fef08a" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

def render_frame_azkar(f, t):
    rot = t * 360.0
    pulse = 1.0 + 0.04 * math.sin(t * 4 * math.pi)
    beads = []
    num_beads = 24
    for i in range(num_beads):
        angle = (i / num_beads) * 2 * math.pi + (t * 2 * math.pi)
        r = 65
        bx = 120 + r * math.cos(angle)
        by = 120 + r * math.sin(angle)
        # Highlight top bead
        is_top = (angle % (2 * math.pi)) < 0.3
        bcolor = "#fffbeb" if is_top else "#f59e0b"
        bsize = 6.5 if is_top else 4.8
        beads.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{bsize}" fill="{bcolor}" stroke="#d97706" stroke-width="1"/>')
    beads_svg = "\n".join(beads)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#041315"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.85"/>
      <!-- Tasbih orbit -->
      <circle cx="120" cy="120" r="65" fill="none" stroke="#fde047" stroke-width="1.5" stroke-dasharray="2 4" opacity="0.6"/>
      {beads_svg}
      <!-- Central glowing star -->
      <g transform="translate(120,120) rotate({-rot * 0.5}) scale({pulse}) translate(-120,-120)">
        <polygon points="120,86 128,110 154,110 133,124 141,148 120,134 99,148 107,124 86,110 112,110" 
                 fill="url(#gold-metallic)" stroke="#fffbeb" stroke-width="2" filter="url(#soft-glow)"/>
        <circle cx="120" cy="120" r="9" fill="#041315"/>
        <circle cx="120" cy="120" r="5" fill="#fef08a"/>
      </g>
    </svg>
    """

def render_frame_wird(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    ray_rot = t * 180.0
    sparkle_y = 100 - (t * 40)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#031620"/>
      <circle cx="120" cy="130" r="90" fill="url(#sun-glow)" opacity="0.9"/>
      <!-- Rising light rays -->
      <g transform="translate(120,130) rotate({ray_rot})">
        <path d="M0 -70 L5 0 L-5 0 Z" fill="#fde047" opacity="0.3"/>
        <path d="M0 70 L5 0 L-5 0 Z" fill="#fde047" opacity="0.3"/>
        <path d="M-70 0 L0 5 L0 -5 Z" fill="#fde047" opacity="0.3"/>
        <path d="M70 0 L0 5 L0 -5 Z" fill="#fde047" opacity="0.3"/>
      </g>
      <!-- Holy Book Opened -->
      <g transform="translate(120,130) scale({pulse}) translate(-120,-130)">
        <!-- Book base/stand -->
        <path d="M90 160 L120 178 L150 160 L140 170 L120 185 L100 170 Z" fill="#92400e" stroke="#f59e0b" stroke-width="1.5"/>
        <!-- Book Pages -->
        <path d="M120 145 C145 132 175 136 190 148 L185 106 C170 94 140 92 120 102 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="1.8" filter="url(#soft-glow)"/>
        <path d="M120 145 C95 132 65 136 50 148 L55 106 C70 94 100 92 120 102 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="1.8" filter="url(#soft-glow)"/>
        <!-- Spine spine light -->
        <line x1="120" y1="98" x2="120" y2="152" stroke="#fffbeb" stroke-width="3" filter="url(#soft-glow)"/>
        <!-- Rising stardust -->
        <circle cx="115" cy="{sparkle_y}" r="3" fill="#fef08a" filter="url(#soft-glow)"/>
        <circle cx="130" cy="{sparkle_y + 15}" r="2" fill="#fff" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

def render_frame_ruqyah(f, t):
    pulse = 1.0 + 0.07 * math.sin(t * 2 * math.pi)
    ring1 = (t * 80) % 80
    ring2 = ((t + 0.5) * 80) % 80
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#1b0a04"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.9"/>
      <!-- Radiating healing energy rings -->
      <circle cx="120" cy="120" r="{ring1}" fill="none" stroke="#fde047" stroke-width="2.5" opacity="{max(0, 1 - ring1/80)}" filter="url(#soft-glow)"/>
      <circle cx="120" cy="120" r="{ring2}" fill="none" stroke="#ea580c" stroke-width="2" opacity="{max(0, 1 - ring2/80)}"/>
      <!-- Healing Heart & Hands Icon -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <path d="M120 170 C70 140 60 100 80 80 C100 60 120 85 120 85 C120 85 140 60 160 80 C180 100 170 140 120 170 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="3" filter="url(#soft-glow)"/>
        <!-- Divine Light Core -->
        <circle cx="120" cy="110" r="18" fill="#fffbeb" filter="url(#soft-glow)"/>
        <circle cx="120" cy="110" r="10" fill="#f59e0b"/>
      </g>
    </svg>
    """

def render_frame_douas(f, t):
    pulse = 1.0 + 0.04 * math.sin(t * 2 * math.pi)
    sparkles = []
    for i in range(7):
        prog = (t + i / 7.0) % 1.0
        sx = 120 + 40 * math.sin(prog * 2 * math.pi + i)
        sy = 160 - (prog * 110)
        opacity = math.sin(prog * math.pi)
        sparkles.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{2.5 + i*0.3}" fill="#fde047" opacity="{opacity:.2f}" filter="url(#soft-glow)"/>')
    sparkles_svg = "\n".join(sparkles)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#041615"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.9"/>
      {sparkles_svg}
      <!-- Praying Hands Silhouette with Golden Glow -->
      <g transform="translate(120,135) scale({pulse}) translate(-120,-135)">
        <!-- Left Hand -->
        <path d="M112 170 C95 160 80 135 85 110 C88 95 95 90 100 95 C105 100 108 120 114 140 Z" 
              fill="url(#gold-metallic)" stroke="#fffbeb" stroke-width="2.5" filter="url(#soft-glow)"/>
        <!-- Right Hand -->
        <path d="M128 170 C145 160 160 135 155 110 C152 95 145 90 140 95 C135 100 132 120 126 140 Z" 
              fill="url(#gold-metallic)" stroke="#fffbeb" stroke-width="2.5" filter="url(#soft-glow)"/>
        <!-- Central blessing beam -->
        <line x1="120" y1="130" x2="120" y2="70" stroke="#fff" stroke-width="3" stroke-linecap="round" filter="url(#soft-glow)"/>
        <circle cx="120" cy="65" r="7" fill="#fef08a" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

def render_frame_ouvertures(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    door_open = 15 * (0.5 + 0.5 * math.sin(t * 2 * math.pi))
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#181103"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <!-- Arch Portal of Openings (Bab al-Fath) -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <!-- Outer Golden Arch -->
        <path d="M65 185 V110 C65 70 175 70 175 110 V185 Z" fill="none" stroke="url(#gold-metallic)" stroke-width="8" filter="url(#soft-glow)"/>
        <!-- Inner brilliant light pouring from doorway -->
        <path d="M74 180 V115 C74 80 166 80 166 115 V180 Z" fill="#fffbeb" filter="url(#soft-glow)"/>
        <!-- Golden keyhole/rays in center -->
        <circle cx="120" cy="115" r="14" fill="#f59e0b"/>
        <polygon points="113,115 127,115 124,145 116,145" fill="#f59e0b"/>
        <!-- Key of Victory -->
        <circle cx="120" cy="70" r="16" fill="none" stroke="url(#gold-metallic)" stroke-width="4.5" filter="url(#soft-glow)"/>
        <line x1="120" y1="86" x2="120" y2="140" stroke="url(#gold-metallic)" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="120" y1="120" x2="132" y2="120" stroke="url(#gold-metallic)" stroke-width="4"/>
        <line x1="120" y1="132" x2="130" y2="132" stroke="url(#gold-metallic)" stroke-width="4"/>
      </g>
    </svg>
    """

def render_frame_elevation(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    rot = t * 360.0
    stair_offset = (t * 30) % 30
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#03160f"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.9"/>
      <!-- Ascending arrows / stairs of elevation -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <!-- Rising chevron 1 -->
        <path d="M80 170 L120 135 L160 170" fill="none" stroke="url(#gold-metallic)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        <!-- Rising chevron 2 -->
        <path d="M80 135 L120 100 L160 135" fill="none" stroke="url(#gold-metallic)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
        <!-- Top Arrow with Crown Star -->
        <path d="M80 100 L120 65 L160 100" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft-glow)"/>
        <!-- Summit 8-pointed star -->
        <g transform="translate(120,55) rotate({rot})">
          <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" fill="url(#gold-metallic)" stroke="#fff" stroke-width="1.5" filter="url(#soft-glow)"/>
        </g>
      </g>
    </svg>
    """

def render_frame_protection(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    rot = t * 360.0
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#040e21"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.9"/>
      <!-- Defense shockwaves -->
      <g transform="translate(120,120) rotate({rot})">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#fde047" stroke-width="2" stroke-dasharray="6 8" opacity="0.7"/>
        <polygon points="0,-95 67,-67 95,0 67,67 0,95 -67,67 -95,0 -67,-67" fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
      </g>
      <!-- Fortress Shield -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <path d="M120 35 L190 65 V125 C190 175 120 206 120 206 C120 206 50 175 50 125 V65 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="3" filter="url(#soft-glow)"/>
        <path d="M120 48 L178 72 V122 C178 162 120 188 120 188 C120 188 62 162 62 122 V72 Z" 
              fill="#1e3a8a" opacity="0.95"/>
        <circle cx="120" cy="115" r="30" fill="none" stroke="url(#gold-metallic)" stroke-width="4" filter="url(#soft-glow)"/>
        <circle cx="120" cy="115" r="12" fill="#fef08a" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

def render_frame_sihr_mauvais_oeil(f, t):
    pulse = 1.0 + 0.06 * math.sin(t * 2 * math.pi)
    eye_pupil_scale = 1.0 + 0.2 * math.sin(t * 4 * math.pi)
    rot = t * 360.0
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#1b0802"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <!-- Radiating Sun Beams destroying darkness -->
      <g transform="translate(120,120) rotate({rot})">
        <line x1="0" y1="-85" x2="0" y2="-105" stroke="#fde047" stroke-width="3" stroke-linecap="round" filter="url(#soft-glow)"/>
        <line x1="0" y1="85" x2="0" y2="105" stroke="#fde047" stroke-width="3" stroke-linecap="round" filter="url(#soft-glow)"/>
        <line x1="-85" y1="0" x2="-105" y2="0" stroke="#fde047" stroke-width="3" stroke-linecap="round" filter="url(#soft-glow)"/>
        <line x1="85" y1="0" x2="105" y2="0" stroke="#fde047" stroke-width="3" stroke-linecap="round" filter="url(#soft-glow)"/>
      </g>
      <!-- Divine Talismanic Eye of Protection -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <path d="M35 120 C70 65 170 65 205 120 C170 175 70 175 35 120 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="4" filter="url(#soft-glow)"/>
        <!-- Inner Sclera -->
        <path d="M50 120 C80 75 160 75 190 120 C160 165 80 165 50 120 Z" fill="#fffbeb"/>
        <!-- Iris & Glowing Core -->
        <circle cx="120" cy="120" r="32" fill="#c2410c"/>
        <circle cx="120" cy="120" r="22" fill="#f59e0b"/>
        <circle cx="120" cy="120" r="{10 * eye_pupil_scale}" fill="#040e21"/>
        <circle cx="114" cy="114" r="5" fill="#ffffff"/>
      </g>
    </svg>
    """

def render_frame_provisions(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    coin_rot = t * 360.0
    sparkles = []
    for i in range(8):
        cy = (t * 180 + i * 30) % 200 + 20
        cx = 60 + ((i * 37) % 120)
        sparkles.append(f'<circle cx="{cx}" cy="{cy:.1f}" r="{2 + (i%3)}" fill="#fef08a" opacity="0.85" filter="url(#soft-glow)"/>')
    sparkles_svg = "\n".join(sparkles)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#02170e"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      {sparkles_svg}
      <!-- Celestial Golden Coins of Sustenance (Rizq) -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <!-- Back Coin -->
        <g transform="translate(95, 130) rotate({coin_rot * 0.5})">
          <circle cx="0" cy="0" r="36" fill="url(#gold-metallic)" stroke="#fff" stroke-width="3" filter="url(#soft-glow)"/>
          <circle cx="0" cy="0" r="28" fill="#d97706" stroke="#fef08a" stroke-width="1.5"/>
          <text x="0" y="7" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">✦</text>
        </g>
        <!-- Front Main Coin -->
        <g transform="translate(145, 110) rotate({-coin_rot * 0.5})">
          <circle cx="0" cy="0" r="42" fill="url(#gold-metallic)" stroke="#fff" stroke-width="3.5" filter="url(#soft-glow)"/>
          <circle cx="0" cy="0" r="34" fill="#b45309" stroke="#fef08a" stroke-width="2"/>
          <text x="0" y="8" text-anchor="middle" font-size="26" font-weight="900" fill="#fde047">۞</text>
        </g>
      </g>
    </svg>
    """

def render_frame_deblocage(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    unlocked_offset = -14 * (0.5 + 0.5 * math.sin(t * 2 * math.pi))
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#02141f"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <!-- Burst rays of freedom -->
      <g transform="translate(120,120) rotate({t * 180})">
        <line x1="0" y1="-85" x2="0" y2="-100" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="60" y1="-60" x2="72" y2="-72" stroke="#fde047" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-60" y1="-60" x2="-72" y2="-72" stroke="#fde047" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <!-- Glowing Unlocked Padlock -->
      <g transform="translate(120,125) scale({pulse}) translate(-120,-125)">
        <!-- Shackle (Moving up & opening) -->
        <g transform="translate(0, {unlocked_offset})">
          <path d="M92 110 V70 C92 48 148 48 148 70 V92" fill="none" stroke="url(#gold-metallic)" stroke-width="10" stroke-linecap="round" filter="url(#soft-glow)"/>
        </g>
        <!-- Body -->
        <rect x="74" y="105" width="92" height="74" rx="18" fill="url(#gold-metallic)" stroke="#fff" stroke-width="3" filter="url(#soft-glow)"/>
        <rect x="84" y="115" width="72" height="54" rx="12" fill="#0369a1" opacity="0.9"/>
        <!-- Keyhole with light beaming -->
        <circle cx="120" cy="135" r="9" fill="#fef08a" filter="url(#soft-glow)"/>
        <polygon points="115,135 125,135 123,155 117,155" fill="#fef08a" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

def render_frame_favoris(f, t):
    pulse = 1.0 + 0.08 * math.sin(t * 4 * math.pi)
    ring_radius = (t * 80) % 80
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#1f020c"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <!-- Radiating love/favorite pulse rings -->
      <circle cx="120" cy="120" r="{ring_radius}" fill="none" stroke="#f43f5e" stroke-width="2" opacity="{max(0, 1 - ring_radius/80)}" filter="url(#soft-glow)"/>
      <!-- Luminous Golden Heart -->
      <g transform="translate(120,120) scale({pulse}) translate(-120,-120)">
        <path d="M120 185 C65 145 45 105 65 75 C85 45 120 70 120 70 C120 70 155 45 175 75 C195 105 175 145 120 185 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="3.5" filter="url(#soft-glow)"/>
        <path d="M120 170 C75 135 60 102 75 78 C90 54 120 75 120 75 C120 75 150 54 165 78 C180 102 165 135 120 170 Z" 
              fill="#be123c" opacity="0.9"/>
        <!-- Star of devotion in center -->
        <circle cx="120" cy="115" r="14" fill="#fffbeb" filter="url(#soft-glow)"/>
        <circle cx="120" cy="115" r="7" fill="#f59e0b"/>
      </g>
    </svg>
    """

def render_frame_secrets_asrar(f, t):
    rot = t * 360.0
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#041212"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <!-- Rotating Khatim (Islamic Octagram / Rub el Hizb) -->
      <g transform="translate(120,120) rotate({rot}) scale({pulse}) translate(-120,-120)">
        <rect x="68" y="68" width="104" height="104" rx="8" fill="none" stroke="url(#gold-metallic)" stroke-width="5" filter="url(#soft-glow)"/>
        <g transform="translate(120,120) rotate(45) translate(-120,-120)">
          <rect x="68" y="68" width="104" height="104" rx="8" fill="none" stroke="url(#gold-metallic)" stroke-width="5" filter="url(#soft-glow)"/>
        </g>
        <circle cx="120" cy="120" r="46" fill="#042f2e" stroke="#fffbeb" stroke-width="2.5"/>
        <circle cx="120" cy="120" r="22" fill="url(#gold-metallic)" filter="url(#soft-glow)"/>
        <circle cx="120" cy="120" r="8" fill="#ffffff"/>
      </g>
    </svg>
    """

def render_frame_recettes_spirituelles(f, t):
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    sparkles = []
    for i in range(6):
        prog = (t + i / 6.0) % 1.0
        sy = 130 - prog * 70
        sx = 120 + 25 * math.sin(prog * 4 * math.pi + i)
        sparkles.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="{2 + i*0.4}" fill="#fde047" opacity="{math.sin(prog * math.pi):.2f}" filter="url(#soft-glow)"/>')
    sparkles_svg = "\n".join(sparkles)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#13081e"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      {sparkles_svg}
      <!-- Mystic Alchemical Golden Flask -->
      <g transform="translate(120,130) scale({pulse}) translate(-120,-130)">
        <path d="M106 65 H134 V95 L165 155 C175 175 155 190 135 190 H105 C85 190 65 175 75 155 L106 95 Z" 
              fill="url(#gold-metallic)" stroke="#fff" stroke-width="3.5" filter="url(#soft-glow)"/>
        <path d="M110 100 L85 152 C78 167 92 182 108 182 H132 C148 182 162 167 155 152 L130 100 Z" 
              fill="#6b21a8" opacity="0.9"/>
        <!-- Radiant core elixir -->
        <circle cx="120" cy="155" r="16" fill="#fef08a" filter="url(#soft-glow)"/>
        <circle cx="120" cy="155" r="8" fill="#f59e0b"/>
      </g>
    </svg>
    """

def render_frame_protections(f, t):
    return render_frame_versets_protection(f, t)

def render_frame_default(f, t):
    rot = t * 360.0
    pulse = 1.0 + 0.05 * math.sin(t * 2 * math.pi)
    return f"""
    <svg width="{SIZE}" height="{SIZE}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      {create_svg_defs()}
      <rect width="{SIZE}" height="{SIZE}" rx="44" fill="#04140e"/>
      <circle cx="120" cy="120" r="95" fill="url(#sun-glow)" opacity="0.95"/>
      <g transform="translate(120,120) rotate({rot}) scale({pulse}) translate(-120,-120)">
        <polygon points="120,50 140,95 190,95 150,125 165,175 120,145 75,175 90,125 50,95 100,95" 
                 fill="url(#gold-metallic)" stroke="#fff" stroke-width="3" filter="url(#soft-glow)"/>
        <circle cx="120" cy="120" r="28" fill="#064e3b" stroke="#fef08a" stroke-width="2"/>
        <circle cx="120" cy="120" r="12" fill="#fef08a" filter="url(#soft-glow)"/>
      </g>
    </svg>
    """

CATEGORIES = [
    ("versets-protection", render_frame_versets_protection),
    ("azkar", render_frame_azkar),
    ("wird", render_frame_wird),
    ("ruqyah", render_frame_ruqyah),
    ("douas", render_frame_douas),
    ("ouvertures", render_frame_ouvertures),
    ("elevation", render_frame_elevation),
    ("protection", render_frame_protection),
    ("sihr-mauvais-oeil", render_frame_sihr_mauvais_oeil),
    ("provisions", render_frame_provisions),
    ("deblocage", render_frame_deblocage),
    ("favoris", render_frame_favoris),
    ("secrets-asrar", render_frame_secrets_asrar),
    ("recettes-spirituelles", render_frame_recettes_spirituelles),
    ("protections", render_frame_protections),
    ("default", render_frame_default),
]

def generate_video_for_category(cat_id, render_func):
    temp_dir = f"temp_frames_{cat_id}"
    os.makedirs(temp_dir, exist_ok=True)
    out_file = os.path.join(OUTPUT_DIR, f"{cat_id}.mp4")

    print(f"🎬 Generating video for '{cat_id}' ({TOTAL_FRAMES} frames)...")
    for f in range(TOTAL_FRAMES):
        t = f / float(TOTAL_FRAMES)
        svg_content = render_func(f, t)
        with open(os.path.join(temp_dir, f"frame_{f:03d}.svg"), "w") as svg_file:
            svg_file.write(svg_content)

    # Encode with ffmpeg
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", os.path.join(temp_dir, "frame_%03d.svg"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-profile:v", "baseline",
        "-level", "3.0",
        "-preset", "fast",
        "-crf", "22",
        "-movflags", "+faststart",
        out_file
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    shutil.rmtree(temp_dir)
    if res.returncode == 0:
        size_kb = os.path.getsize(out_file) / 1024.0
        print(f"✅ Generated {out_file} ({size_kb:.1f} KB)")
    else:
        print(f"❌ Error generating {out_file}: {res.stderr[:200]}")

def main():
    print(f"🌟 Starting generation of {len(CATEGORIES)} professional category videos...")
    for cat_id, render_func in CATEGORIES:
        generate_video_for_category(cat_id, render_func)
    print("🎉 All category videos generated successfully!")

if __name__ == "__main__":
    main()
