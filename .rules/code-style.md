# Code Style Guidelines

## Purpose

This document defines the coding standards, style conventions, and best practices that should be followed throughout the Daily Notes of Love project to ensure consistency, readability, and maintainability.

## Scope

These guidelines apply to all TypeScript, JavaScript, CSS, and HTML code in the project, including components, utilities, scripts, and configuration files.

## Guidelines

### TypeScript/JavaScript

1. **General Formatting**
   - Use 2 spaces for indentation
   - Use semicolons at the end of statements
   - Maximum line length of 100 characters
   - Use single quotes for strings
   - Add trailing commas in multi-line object literals and arrays

2. **TypeScript Usage**
   - Always define types for function parameters and return values
   - Use interfaces for object shapes
   - Avoid using `any` type when possible
   - Use type annotations for React component props and state

3. **Naming Conventions**
   - Use `PascalCase` for component names and type/interface names
   - Use `camelCase` for variables, functions, and method names
   - Use `UPPER_SNAKE_CASE` for constants
   - Use descriptive names that reflect the purpose

4. **Component Structure**
   - One component per file
   - Export components as default when they are the main export
   - Group imports by: React/Next.js, external libraries, internal components, styles
   - Define prop interfaces at the top of the file

### React/Next.js

1. **Component Best Practices**
   - Use functional components with hooks
   - Extract complex logic into custom hooks
   - Use React.memo for performance optimization where appropriate
   - Keep components focused on a single responsibility

2. **State Management**
   - Use local state for component-specific state
   - Lift state up when needed by multiple components
   - Avoid prop drilling by using context or composition
   - Use useReducer for complex state logic

3. **Next.js Conventions**
   - Follow Next.js file-based routing conventions
   - Use getStaticProps for data fetching at build time
   - Properly handle dynamic imports and SSG/SSR constraints

### CSS/Styling

1. **TailwindCSS**
   - Follow utility-first approach
   - Group related classes together
   - Extract common patterns to components
   - Use consistent color and spacing values

2. **Custom CSS**
   - When needed, use CSS modules
   - Follow BEM naming convention for custom CSS classes
   - Keep selectors simple and specific
   - Avoid !important when possible

### Error Handling

1. **Proper Error Management**
   - Use try/catch blocks for error-prone operations
   - Provide meaningful error messages
   - Gracefully handle failures with fallbacks
   - Log errors with appropriate context

## Examples

### Component Structure Example

```tsx
// Good component structure
import React, { useState, useEffect } from 'react';
import { Card, Button } from '@heroui/react';
import { formatDate } from '@/utils/dates';
import { Note } from '@/types/notes';

interface NoteCardProps {
  note: Note;
  onAction: (id: string) => void;
}

export default function NoteCard({ note, onAction }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold">{formatDate(note.date)}</h3>
      </CardHeader>
      {/* Component content */}
    </Card>
  );
}
```

### TailwindCSS Usage Example

```tsx
// Good TailwindCSS usage
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
  <div className="flex flex-col">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
      {title}
    </h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
  <Button 
    onClick={handleAction}
    className="ml-4"
  >
    Action
  </Button>
</div>
```

## References

- [TypeScript Style Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Next.js Best Practices](https://nextjs.org/docs/pages/building-your-application/routing) 