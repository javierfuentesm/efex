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
