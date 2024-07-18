## Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- Node.js (>=14.x)
- npm (comes with Node.js)

### Installation
1. Clone the repository:

   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

3. Install the dependencies:

   "npm install"
   
4. Install Playwright browsers:
   "npx playwright install"
   
Running Tests
Running All Tests
To run all tests, use the following command:

"npx playwright test"

5. Running a Specific Test
To run a specific test file, use:

"npx playwright test path/to/your/testfile.spec.ts"

Headless Mode
By default, Playwright runs in headless mode. If you want to see the browser UI during the test, you can run tests in headful mode by adding the --headed flag:

"npx playwright test --headed"
