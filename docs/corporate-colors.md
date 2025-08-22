# Corporate Color System

This document outlines the corporate color system for the Top Travel application, based on the provided corporate colors.

## Primary Corporate Colors

### Blue

- **RGB**: 30, 73, 110
- **HSL**: 210, 57%, 27%
- **Usage**: Primary brand color, main actions, navigation, headers

### Red

- **RGB**: 187, 80, 60
- **HSL**: 10, 51%, 48%
- **Usage**: Accent color, call-to-action buttons, alerts, highlights

## Color Palette

### Blue Variations

- `corporate-blue`: Main corporate blue (210, 57%, 27%)
- `blue-light`: Light blue (210, 57%, 85%)
- `blue-lighter`: Very light blue (210, 57%, 95%)
- `blue-dark`: Dark blue (210, 57%, 20%)
- `blue-darker`: Very dark blue (210, 57%, 15%)

### Red Variations

- `corporate-red`: Main corporate red (10, 51%, 48%)
- `red-light`: Light red (10, 51%, 85%)
- `red-lighter`: Very light red (10, 51%, 95%)
- `red-dark`: Dark red (10, 51%, 35%)
- `red-darker`: Very dark red (10, 51%, 25%)

### Neutral Grays

- `gray-50` to `gray-900`: Complementary gray scale designed to work with corporate colors

## Usage Guidelines

### Light Mode

- **Background**: Pure white
- **Primary**: Corporate blue
- **Secondary**: Light blue
- **Accent**: Light red
- **Destructive**: Corporate red
- **Text**: Dark gray (gray-900)
- **Muted text**: Medium gray (gray-500)

### Dark Mode

- **Background**: Very dark gray (gray-900)
- **Primary**: Corporate blue
- **Secondary**: Dark gray (gray-800)
- **Accent**: Medium gray (gray-700)
- **Destructive**: Corporate red
- **Text**: Light gray (gray-50)
- **Muted text**: Medium gray (gray-400)

## CSS Variables

The color system uses CSS custom properties (variables) for consistency:

```css
:root {
  --corporate-blue: 210 57% 27%;
  --corporate-red: 10 51% 48%;
  --blue-light: 210 57% 85%;
  --blue-lighter: 210 57% 95%;
  /* ... more variables */
}
```

## Tailwind Utility Classes

You can use these utility classes throughout the application:

### Background Colors

```html
<div class="bg-corporate-blue">Primary blue background</div>
<div class="bg-corporate-red">Red background</div>
<div class="bg-blue-light">Light blue background</div>
<div class="bg-red-lighter">Very light red background</div>
```

### Text Colors

```html
<h1 class="text-corporate-blue">Blue heading</h1>
<p class="text-corporate-red">Red text</p>
<span class="text-blue-dark">Dark blue text</span>
```

### Border Colors

```html
<div class="border border-corporate-blue">Blue border</div>
<div class="border-2 border-corporate-red">Thick red border</div>
```

### Button Examples

```html
<!-- Primary button -->
<button class="bg-corporate-blue text-white hover:bg-blue-dark">
  Primary Action
</button>

<!-- Secondary button -->
<button class="bg-blue-lighter text-corporate-blue hover:bg-blue-light">
  Secondary Action
</button>

<!-- Destructive button -->
<button class="bg-corporate-red text-white hover:bg-red-dark">Delete</button>

<!-- Accent button -->
<button class="bg-red-lighter text-corporate-red hover:bg-red-light">
  Special Action
</button>
```

## Component Usage

### Cards

```html
<div class="bg-card border border-border">
  <h3 class="text-corporate-blue">Card Title</h3>
  <p class="text-muted-foreground">Card content</p>
</div>
```

### Navigation

```html
<nav class="bg-corporate-blue text-white">
  <a href="#" class="hover:bg-blue-dark">Home</a>
  <a href="#" class="hover:bg-blue-dark">About</a>
</nav>
```

### Alerts

```html
<div class="bg-red-lighter border border-corporate-red text-corporate-red">
  Warning message
</div>

<div class="bg-blue-lighter border border-corporate-blue text-corporate-blue">
  Information message
</div>
```

## Accessibility

The color combinations have been tested for accessibility:

- **Contrast ratios**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Color blindness**: The blue and red combination works well for most color vision deficiencies
- **Focus indicators**: Use the corporate blue for focus rings and outlines

## Best Practices

1. **Use corporate blue as the primary color** for main actions, navigation, and branding
2. **Use corporate red sparingly** for important actions, alerts, and highlights
3. **Maintain consistency** by using the predefined color variations
4. **Consider context** - use lighter variations for backgrounds, darker for text
5. **Test in both light and dark modes** to ensure readability
6. **Use semantic colors** (primary, secondary, destructive) rather than hardcoded values

## Migration Notes

When updating existing components:

1. Replace generic colors with corporate color utilities
2. Update hover states to use appropriate color variations
3. Ensure proper contrast ratios are maintained
4. Test components in both light and dark modes
