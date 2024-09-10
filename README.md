# React + TypeScript + Vite

This project is a React application built with TypeScript and Vite.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Running the Project

To start the development server:

```
npm run dev
```

This will start the Vite development server. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173).

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

This project uses Playwright for end-to-end testing. To run the tests:

1. Install Playwright browsers (if not already installed):
   ```
   npx playwright install
   ```

2. Run the tests:
   ```
   npx playwright test
   ```

To view the test report:

```
npx playwright show-report
```


## Technical Decisions

### API Simulation
Due to CORS issues with the original API, a JavaScript function was implemented to simulate backend behavior. While this allows for development and testing without backend dependencies, it's important to note that using the actual API would be ideal in a production environment. The simulation approach has some limitations:

- It doesn't allow for intercepting endpoints with Playwright for testing error scenarios or loading states, which would be possible with a real API.
- It may not accurately represent all possible API responses or edge cases.

### Testing with Playwright
I chose Playwright for end-to-end testing due to its numerous benefits:

- Faster test execution compared to other frameworks.
- Cross-browser testing capabilities.
- Automatic wait functionality, reducing the need for explicit waits.
- Powerful tracing feature for debugging failed tests.
- Strong TypeScript support.

### State Management
TanStack Query (formerly React Query) was used for "state management" and data fetching. Its benefits include:

- Simplified data fetching and caching.
- Automatic background refetching.
- Easy pagination and infinite scrolling support.
- Built-in devtools for debugging.

Given these features, I didn't see an immediate need for additional state management solutions like Redux or Context API for this project's current scope.

### UI Components
I chose Chakra UI as the component library for this project. Its benefits include:

- Highly customizable and accessible components out of the box.
- Excellent theming support.
- Built-in dark mode. (if required in the future)
- Responsive design utilities.
- Strong TypeScript support.

## Deployment

The application is deployed and accessible at https://efex.vercel.app


