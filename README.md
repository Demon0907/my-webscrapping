This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# E-commerce Order Scraper

Brief description of your project and what it does.

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Any other specific requirements

## Installation

1. Clone the repository
2. Install dependencies: `yarn install` or `npm install`
3. Start the development server: `yarn run dev` or `npm run dev`

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
Once the server is running, you can access the application at `http://localhost:3000`.

## Usage
- Select the platform (Amazon or Ajio)

## Important Login Steps:
1. For Order History Scraping:
   - Login with Amazon credentials
   - View your recent order history automatically extracted

2. For Manual Factor Authentication (MFA):
   - Login with Ajio mobile number
   - Complete OTP verification manually
   - Access your Ajio account securely

## Amazon Login and Order Scraping
- Automated Amazon login
- Handles 2FA verification if required (waits for manual verification)
- Extracts order details including:
  - Product name
  - Price
  - Product link
  - Order date
- Supports both production and development environments
- Works on both Windows and MacOS

## Usage

1. Start the application:
2. The scraper will:
   - Launch a Chrome browser instance
   - Navigate to Amazon
   - Log in using your credentials
   - Extract details of up to 10 most recent orders
   - Return the order data in JSON format

## Error Handling

The scraper includes handling for:
- Invalid credentials
- 2FA verification for recaptcha
- Manual email correction if needed

-------------------------------------------

## Ajio Login Automation

This module provides automated login functionality for Ajio.com using Puppeteer.

### Key Features

- Automated browser initialization with custom configurations
- Handles login process including OTP verification with Manual Factor Authentication(MFA)
- Manages modal popups automatically
- Includes error handling and timeout management

### Main Functions

#### `initialize()`
Initializes a new browser instance with required configurations.


#### `login(page, url, credentials)`
Handles the complete login flow including:
- Navigation to login page
- Modal handling
- Mobile number input
- OTP verification
- Login status verification
