import { Page, Locator } from '@playwright/test';
import path from 'path';

export class LoginPage {

    readonly page: Page;

    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.username = page.locator('#user-name');
        this.password = page.locator('#password');
        this.loginButton = page.locator('#login-button');
    }

    async open() {
        const filePath = path.resolve(__dirname, '../login.html');
        await this.page.goto(`file://${filePath}`);
    }

    async login(user: string, pass: string) {

        await this.username.fill(user);

        await this.password.fill(pass);

        await this.loginButton.click();
    }

}
