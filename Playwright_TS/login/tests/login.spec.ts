import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login with undefined user should fail', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login('unknown_user', 'wrong_pass');

    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#error-message')).toContainText('Invalid');
});

test('login with valid user should succeed', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();

    await loginPage.login('admin', 'admin123');

    await expect(page.locator('#welcome-message')).toBeVisible();
    await expect(page.locator('#welcome-message')).toContainText('Welcome, admin');
});
