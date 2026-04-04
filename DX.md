# Developer Experience (DX) Guidelines

## React Patterns and Best Practices

### Core Philosophy
- **UIs are thin wrappers over data** - avoid using local state (like useState) unless absolutely necessary
- Even when local state seems needed, consider if you can flatten the UI state into a basic calculation
- useState is only necessary if it's truly reactive and cannot be derived

### State Management
- **Choose state machines over multiple useStates** - multiple useState calls make code harder to reason about
- Prefer a single state object with reducers for complex state logic
- Co-locate related state rather than spreading it across multiple useState calls

### Component Architecture
- **Create new component abstractions when nesting conditional logic**
- Move complex logic to new components rather than deeply nested conditionals
- Use ternaries only for small, easily readable logic
- Avoid top-level if/else statements in JSX - extract to components instead

### Side Effects and Dependencies
- **Avoid putting dependent logic in useEffects** - it causes misdirection about what the logic is doing
- Choose to explicitly define logic rather than depend on implicit reactive behavior
- When useEffect is necessary, be explicit about dependencies and cleanup
- Prefer derived state and event handlers over effect-driven logic

### Timing and Async Patterns
- **setTimeouts are flaky and usually a hack** - always provide a comment explaining why setTimeout is needed
- Consider alternatives like:
  - Proper loading states
  - Suspense boundaries
  - Event-driven patterns
  - State machines with delayed transitions
  - requestAnimationFrame and queueMicrotask

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure files: exported component, subcomponents, helpers, static content, types
- Use `console.log({ value })` instead of `console.log(value)`
- Use `onCallback` instead of `handleCallback`
- Use flex and gap instead of space-x-n and space-y-n
- Use `cn` to compose class names
- Just pass ref directly to the component because of React 19

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use maps instead
- Use functional components with TypeScript interfaces

## Syntax and Formatting

- Use the "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
- Use declarative JSX

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling
- Implement responsive design with Tailwind CSS; use a mobile-first approach

## Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use WebP format, include size data, implement lazy loading

## Key Conventions

- Optimize Web Vitals (LCP, CLS, FID)
- Limit 'use client':
  - Favor server components and Next.js SSR
  - Use only for Web API access in small components
  - Avoid for data fetching or state management
- Follow Next.js docs for Data Fetching, Rendering, and Routing

## Development Rules

- Make sure not to start the dev server or run type of lint checking on agent mode
- Never create stray markdown files in root - only DX.md, AGENTS.md, and README.md allowed
- All documentation goes in `hexed/` folder
