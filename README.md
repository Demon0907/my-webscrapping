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
Once the server is running, you can access the application at `https://my-webscarping-demon.netlify.app` or `http://localhost:3000`.


## Important Login Steps:
1. For Search Order Scraping:
   - Navigate to `https://my-webscarping-demon.netlify.app/search-order` or `http://localhost:3000/search-order` .
   - Enter your search strings (you can add multiple search terms as needed).
   - View all search results.

2. For Order History Scraping:
   - Navigate to **[Demo](https://my-webscarping-demon.netlify.app/)**
   - Login with Amazon credentials
   - View your recent order history automatically extracted

    > ⚠️ **Note:** The login process may require manual interaction, which could lead to errors if run automatically on the server. I suggest running it on a local machine, as this will open the test browser in Chromium, allowing manual inputs as needed.
**[Vercel issue as resticts to <50MB](https://github.com/orgs/vercel/discussions/124)** - Taking much time to find alternate hosting options

3. For Manual Factor Authentication (MFA):
   - Navigate to  **[Demo](https://my-webscarping-demon.netlify.app/)**
   - Login with Ajio mobile number
   - Complete OTP verification manually
   - Access your Ajio account securely

    > ⚠️ **Note:** The login process may require manual interaction, which could lead to errors if run automatically on the server. I suggest running it on a local machine, as this will open the test browser in Chromium, allowing manual inputs as needed.

## Amazon Product Search Scraper
This project includes functionality to scrape product information from Amazon search results.
The `scrapeAmazon` function allows you to search and scrape product information from Amazon.in. Here's how it works:

### Features

- Searches multiple product terms simultaneously
- Extracts product details including:
  - Product name
  - Price
  - Product link
  - Rating
  - Number of global ratings
- Returns structured data for easy processing

### Usage

- The scraper includes a 2-second delay between consecutive searches
- Additional 1-second wait for page loading
- Automatically waits for search results to load using `.s-search-results` selector

### Limitations

- Currently limited to 10 results per search term by default
- Only works with Amazon.in domain
- Requires an active Puppeteer browser session

### Error Handling

The scraper includes basic error handling:
- Checks for browser initialization
- Validates search results presence
- Returns structured error messages


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

### Usage

1. Start the application:
2. The scraper will:
   - Launch a Chrome browser instance
   - Navigate to Amazon
   - Log in using your credentials
   - Extract details of up to 10 most recent orders
   - Return the order data in JSON format

### Error Handling

The scraper includes handling for:
- Invalid credentials
- 2FA verification for recaptcha
- Manual email correction if needed


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
