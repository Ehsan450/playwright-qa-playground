// @ts-check
import { test, expect } from '@playwright/test';

test.describe.serial('Gold Stock flow', () => {
test('Proposed Gold Stock', async ({ page }) => {
  await page.goto('https://pure-dev-neo.gktechbd.com/login/');


await page.getByLabel('Email').fill(process.env.PROPOSER_EMAIL);
await page.getByLabel('Password').fill(process.env.PROPOSER_PASSWORD);

 await page.getByRole('button', {name:'Login'}).click()
await expect(
  page.getByRole('button', { name: 'Finance' })
).toBeVisible({ timeout: 15000 });


 //await expect(page).toHaveURL('https://pure-dev-neo.gktechbd.com/');

// await page.getByRole('button', { name: 'Finance' }).click();
await page
  .locator('div.flex.justify-between.items-center', { hasText: 'Finance' })
  .click();
//await page.getByRole('link',  { name: 'Gold Stock' }).click();
await page.locator('a[href="/finance-gold-quota/"]').click();
//await expect(page.getByText(/Propose Stock/i)).toBeVisible({ timeout: 15000 });
const proposeRow = page.locator('div:has(> .text-sm:has-text("Propose Stock"))').first();
await proposeRow.getByRole('button').click();
const amount = '600'; 

// try a semantic textbox first:
let amountInput = page.getByRole('textbox', { name: /amount|stock/i }).first();

// fallback if it’s a number input without label:
if (!(await amountInput.count())) {
  amountInput = page.locator('input[type="number"], input[name*="amount"], input[name*="stock"]').first();
}
await amountInput.fill('');          // clear field safely
await amountInput.fill(amount);      // type exact value once
await expect(amountInput).toHaveValue(amount);  // verify it's correct


// await amountInput.click();
// await amountInput.press('Control+A');  // remove the leading 0 cleanly
// await amountInput.press('Delete');
// await amountInput.type(amount, { delay: 40 });

// --- submit ---
await page.getByRole('button', { name: /submit|save|propose/i }).click();

// wait for modal to appear
const modal = page.getByRole('alertdialog');

// optional: assert the confirmation text
await expect(modal).toContainText('Are you sure you want to submit the Proposed Gold Stock?');

// click the confirm action
await modal.getByRole('button', { name: 'Submit Changes' }).click();

// wait for network/UI to settle
await page.waitForLoadState('networkidle');

// 1️⃣ Click the profile/avatar button
await page.locator('[id="radix-:rb:"]').click();


// 2️⃣ Click the logout menu item
await page.locator('button[role="menuitem"]', { hasText: /log ?out/i }).click();


await expect(page).toHaveURL('https://pure-dev-neo.gktechbd.com/login/');


});


test('Proposed Gold Stock Approval' , async({page})=>{
await page.goto('https://pure-dev-neo.gktechbd.com/login/');


await page.getByLabel('Email').fill(process.env.APPROVER_EMAIL);
await page.getByLabel('Password').fill(process.env.APPROVER_PASSWORD);


 await page.getByRole('button', {name:'Login'}).click()

 //await expect(page).toHaveURL('https://pure-dev-neo.gktechbd.com/');
await expect(
  page.getByRole('button', { name: 'Finance' })
).toBeVisible({ timeout: 15000 });



 // await page.getByRole('button', { name: 'Finance' }).click();
await page
  .locator('div.flex.justify-between.items-center', { hasText: 'Finance' })
  .click();
//await page.getByRole('link',  { name: 'Gold Stock' }).click();
await page.locator('a[href="/finance-gold-quota/"]').click();
await page.locator('button', { hasText: "Approve" }).click();
// scope to the open modal
const modal = page.getByRole('alertdialog');               // or: page.locator('[role="alertdialog"][data-state="open"]')
await expect(modal).toBeVisible();

// click "Approve" inside the modal
await modal.getByRole('button', { name: /approve/i }).click();

// optional: wait for modal to close
await expect(modal).toBeHidden();


})
});


