import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Saucedemo Login Tests', () => {

  test('valid login should go to inventory page', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('invalid login should show error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrong_user', 'wrong_pass');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage)
      .toContainText('Username and password do not match');
  });

  test('locked out user should show error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage)
      .toContainText('Sorry, this user has been locked out');
  });

});