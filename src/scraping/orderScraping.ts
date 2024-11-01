import { Page } from "puppeteer";

export interface OrderDetails {
  name: string;
  price: string;
  productLink: string;
  orderDate: string;
}

export interface OrderResponse {
  success: boolean;
  orders: OrderDetails[];
  message: string;
  error?: string;
}

export const getOrderHistory = async (page: Page): Promise<OrderResponse> => {
  console.log("Starting order history extraction...");
  if (!page) {
    return {
      success: false,
      orders: [],
      message: "Browser page not provided",
      error: "PAGE_NOT_INITIALIZED",
    };
  }

  try {
    // Step 1: Wait for orders button
    console.log("Step 1: Waiting for orders button (#nav-orders)...");
    await page.waitForSelector("#nav-orders", { timeout: 5000 });

    // Step 2: Click orders button
    console.log("Step 2: Clicking orders button...");
    await page.click("#nav-orders");

    // Step 3: Wait for orders container
    console.log("Step 4: Waiting for orders container...");
    await page.waitForSelector(".your-orders-content-container");
    console.log("Orders container found");

    // Step 4: Extract order data
    console.log("Step 5: Starting order data extraction...");

    // Add delay to ensure page is fully loaded
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // gets the number of orders based on the text content of the element with the class "num-orders"
    // const orderCount = await page.$eval(".num-orders", (el) =>
    //   parseInt(el.textContent || "0")
    // );

    const orders = await page.evaluate(() => {
      const orderElements = document.querySelectorAll(
        ".your-orders-content-container .a-box-group"
      );

      if (orderElements.length === 0) {
        console.log("No order elements found - DOM may not be ready");
        return { orders: [] };
      }

      const ordersData: Array<{
        name: string;
        price: string;
        productLink: string;
        orderDate: string;
      }> = [];

      orderElements.forEach((order, index) => {
        if (index >= 10) return;

        console.log(`Processing order ${index + 1}`);

        const priceElement = order.querySelector(
          ".a-column.a-span9.a-span-last .a-size-base.a-color-secondary, .a-column.a-span2 .a-size-base.a-color-secondary"
        );
        const dateElement = order.querySelector(
          ".a-column.a-span3 .a-size-base.a-color-secondary"
        );
        const nameElement = order.querySelector(".yohtmlc-product-title");
        const linkElement = order.querySelector(
          ".a-fixed-left-grid-col.a-col-right .a-link-normal"
        ) as HTMLAnchorElement;

        if ((nameElement && linkElement && dateElement) || priceElement) {
          ordersData.push({
            name: nameElement?.textContent?.trim() || "",
            price: priceElement?.textContent?.trim() || "",
            productLink: linkElement?.href || "",
            orderDate: dateElement?.textContent?.trim() || "",
          });
        }
      });
      return { orders: ordersData };
    });

    console.log("Step 6: Order extraction completed");
    console.log("Orders found:", orders.orders.length);

    return {
      success: true,
      orders: orders.orders,
      message: `Successfully fetched ${orders.orders.length} orders`,
    };
  } catch (error) {
    console.error("Error in order extraction:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      orders: [],
      message:
        error instanceof Error
          ? `Failed to fetch orders: ${error.message}`
          : "Failed to fetch orders",
      error: "ORDER_FETCH_ERROR",
    };
  }
};
