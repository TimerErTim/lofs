# HeroUI Best Practices

## Purpose

This document outlines the best practices and guidelines for using HeroUI components in the Daily Notes of Love project, ensuring consistency with the official HeroUI API and preventing usage of deprecated patterns.

## Scope

These guidelines apply to all usage of HeroUI components throughout the codebase, including event handlers, props, and component composition.

## Guidelines

### Event Handlers

1. **Event Handler Naming**
   - Use `onPress` instead of `onClick` for all clickable components
   - Use `onChange` for form elements and selection components
   - Use `onValueChange` for components that manage their own state
   - Use `onSelectionChange` for components like Calendar, Select, etc.

2. **Event Handler Patterns**
   - Event handler props accept functions with typed event parameters
   - For form components, the handler typically receives the value directly
   - For interactive components like Button, the handler receives a React event object

3. **Deprecated Props**
   - `onClick` is deprecated in favor of `onPress` (React Aria standard)
   - `onSelect` is deprecated in favor of component-specific handlers (e.g., `onSelectionChange`)
   - `disabled` is deprecated in favor of `isDisabled`
   - `required` is deprecated in favor of `isRequired`

### Component State

1. **Controlled vs. Uncontrolled Components**
   - Use value/onChange for controlled components
   - Use defaultValue for uncontrolled components
   - Never mix controlled and uncontrolled patterns for the same component

2. **State Naming Conventions**
   - Use `is` prefix for boolean state props (e.g., `isOpen`, `isDisabled`, `isRequired`)
   - Use `defaultXXX` prefix for initial/default values (e.g., `defaultValue`, `defaultOpen`)
   - Use `onXXXChange` for state change callbacks (e.g., `onValueChange`, `onSelectionChange`)

### Styling

1. **Customization**
   - Use className prop for applying TailwindCSS classes
   - Use variant, size, color, and radius props for predefined variations
   - Use Tailwind's arbitrary value syntax (e.g., `[&_[aria-selected=true]]:bg-blue-100`) for advanced styling

2. **Color Schemes**
   - Apply color schemes using `colorScheme` prop rather than custom colors where possible
   - Use HeroUI's built-in color palette to maintain consistency

### Accessibility

1. **ARIA Attributes**
   - Do not manually set aria-* attributes that are already handled by HeroUI
   - Use the appropriate semantic components (Button for buttons, etc.)
   - Ensure proper focus management by using HeroUI's built-in support

## Examples

### Correct Event Handler Usage

```tsx
// Correct - Using onPress for Button
<Button 
  onPress={handleButtonPress} 
  isDisabled={isLoading}
>
  Submit
</Button>

// Correct - Using onChange for Input
<Input
  value={inputValue}
  onChange={handleInputChange}
  isRequired
/>

// Correct - Using onSelectionChange for Calendar
<Calendar
  value={date}
  onChange={handleDateChange}
  isDateUnavailable={isDateUnavailable}
/>
```

### Incorrect Event Handler Usage

```tsx
// Incorrect - Using onClick instead of onPress
<Button 
  onClick={handleButtonClick} 
  disabled={isLoading}
>
  Submit
</Button>

// Incorrect - Using onSelect instead of onChange
<Input
  value={inputValue}
  onSelect={handleInputSelect}
  required
/>
```

### Styling Best Practices

```tsx
// Correct - Using built-in props with className for custom styling
<Button
  variant="ghost"
  size="sm"
  colorScheme="primary"
  className="rounded-full hover:bg-opacity-80"
  onPress={handleAction}
>
  Action
</Button>

// Correct - Using advanced Tailwind selectors for specific styling
<Calendar
  className="w-full [&_[aria-selected=true]]:bg-blue-100 [&_[aria-selected=true]]:dark:bg-blue-900/30"
  value={date}
  onChange={handleDateChange}
/>
```

## References

- [HeroUI Official Documentation](https://www.heroui.com/docs)
- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [HeroUI NextUI Migration Guide](https://www.heroui.com/docs/guide/nextui-to-heroui) 