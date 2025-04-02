# UI and Language Guidelines

## Purpose

This document defines the requirements for UI components and language usage throughout the Daily Notes of Love project, ensuring a consistent, high-quality user experience with proper localization.

## Scope

These guidelines apply to all user interface elements, including components, text content, error messages, and tooltips.

## Guidelines

### HeroUI Components

1. **Component Usage**
   - Use HeroUI components from the `@heroui/react` package for all UI elements wherever possible
   - Follow the official HeroUI documentation for proper component implementation
   - Maintain compatibility with Tailwind CSS v3.4.1
   - Import individual components directly to minimize bundle size

2. **Configuration**
   - Use the HeroUI plugin in the Tailwind configuration
   - Preserve the `heroui()` plugin in the `tailwind.config.ts` file
   - Include the proper content paths for HeroUI theme files
   - Ensure the PostCSS configuration includes the necessary plugins for Tailwind CSS v3.4

3. **Styling**
   - Apply custom styles using Tailwind utility classes
   - Use the HeroUI theming system for consistent styling
   - Maintain proper dark mode support with the `dark:` variant
   - Use the `class` strategy for dark mode implementation

4. **Accessibility**
   - Leverage HeroUI's built-in accessibility features
   - Ensure proper focus management with HeroUI components
   - Maintain semantic HTML structure within components
   - Test all components for keyboard navigation

### German Language

1. **Content Requirements**
   - All user-facing text must be written in German
   - This includes:
     - UI component labels and text
     - Form placeholders and validation messages
     - Error notifications and status messages
     - Page titles and meta descriptions
     - Documentation and help text

2. **Translation Guidelines**
   - Use natural, conversational German rather than direct translations
   - Maintain formal "Sie" form for addressing users
   - Follow German capitalization rules for nouns
   - Use appropriate German punctuation and quotation marks
   - Maintain consistent terminology throughout the application

3. **Date and Number Formatting**
   - Use German date format (DD.MM.YYYY)
   - Use comma as decimal separator and period as thousands separator
   - Follow German conventions for currency formatting
   - Set proper locale for date-fns and other formatting libraries

4. **Calendar Implementation**
   - Ensure the HeroUI Calendar component is configured for German locale
   - Display German month and weekday names
   - Start calendar weeks on Monday (German standard)
   - Use 24-hour time format

## Examples

### Component Usage

Preferred:
```tsx
import { Button, Card, Calendar } from '@heroui/react';

// Use direct component imports
export function MyComponent() {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold">Liebesnotiz</h2>
      <p>Deine tägliche Nachricht der Liebe</p>
      <Button>Weiterlesen</Button>
    </Card>
  );
}
```

### German Text Examples

- Buttons: "Anmelden", "Abbrechen", "Speichern", "Weiter"
- Form labels: "Benutzername", "Passwort", "E-Mail-Adresse"
- Validation: "Dieses Feld ist erforderlich", "Bitte geben Sie eine gültige E-Mail-Adresse ein"
- Dates: "01.04.2023" (for April 1, 2023)

## References

- [HeroUI Official Documentation](https://www.heroui.com/docs)
- [Tailwind CSS v3.4 Documentation](https://tailwindcss.com/docs)
- [German Language Style Guide](https://developers.google.com/style/german)
- [German Localization Best Practices](https://www.w3.org/International/questions/qa-german) 