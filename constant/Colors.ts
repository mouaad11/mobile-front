const Colors = {
    // Primary colors
    PRIMARY: '#0F172A',    // Deep blue
    SECONDARY: '#1E293B',  // Slate
    ACCENT: '#3B82F6',     // Bright blue
    
    // Background colors
    BACKGROUND: '#0F172A',
    CARD_BACKGROUND: '#1E293B',
    MODAL_BACKGROUND: 'rgba(15, 23, 42, 0.9)',
    
    // Text colors
    TEXT_PRIMARY: '#F8FAFC',    // Slate 50
    TEXT_SECONDARY: '#CBD5E1',  // Slate 300
    TEXT_MUTED: '#64748B',      // Slate 500
    
    // Status colors
    SUCCESS: '#22C55E',  // Green 500
    ERROR: '#EF4444',    // Red 500
    WARNING: '#F59E0B',  // Amber 500
    INFO: '#3B82F6',     // Blue 500
    
    // Border and divider colors
    BORDER: '#334155',
    DIVIDER: '#1E293B',
    
    // Gradients
    GRADIENT_START: '#0F172A',
    GRADIENT_END: '#1E293B',
    
    // Overlays
    OVERLAY: 'rgba(15, 23, 42, 0.7)',
    
    // Common colors
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    TRANSPARENT: 'transparent',
    DISABLED: '#475569',
    
    // Shadows
    SHADOW_COLOR: '#000000',
    SHADOW_OPACITY: 0.25,
    SHADOW_RADIUS: 3.84,
    SHADOW_OFFSET: { width: 0, height: 2 },
} as const;

export default Colors;