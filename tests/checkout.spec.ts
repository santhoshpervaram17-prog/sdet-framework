import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { users, checkoutInfo } from './data/testdata';

test.describe('Checkout Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addFirstItemToCart();
    await cartPage.goto();
    await cartPage.clickCheckout();
  });

  test('complete checkout flow', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillInfo(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.zipCode
    );

    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.summaryTotal).toBeVisible();

    await checkoutPage.finish();

    await expect(checkoutPage.confirmationHeader)
      .toHaveText('Thank you for your order!');
  });

  test('checkout without filling info shows error', async ({ page }) => {
    const continueButton = page.locator('[data-test="continue"]');
    await continueButton.click();

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('First Name is required');
  });

});
