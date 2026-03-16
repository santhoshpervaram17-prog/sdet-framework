import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { users } from './data/testdata';

test.describe('Cart Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('add single item to cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addFirstItemToCart();
    await cartPage.goto();

    const count = await cartPage.getCartItemCount();
    expect(count).toBe(1);
  });

  test('cart badge shows correct count', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addFirstItemToCart();

    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toHaveText('1');
  });

  test('remove item from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addFirstItemToCart();
    await cartPage.goto();
    await cartPage.removeFirstItem();

    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

});