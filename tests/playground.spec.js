import {test, expect} from '@playwright/test'
import { ECDH } from 'crypto';
test.describe('QA Playground Tasks' , ()=>{
test("Find Spiderman", async ({ page }) => {
  await page.goto('https://qaplayground.dev/apps/dynamic-table/');

  const spidermanRow = page.locator("tr", {
    has: page.locator("td", { hasText: "Spider-Man" })
  });

  await expect(spidermanRow).toContainText("Peter Parker");
});



test('Verify account', async ({page})=>{
    await page.goto('https://qaplayground.dev/apps/verify-account/')
    const elements = await page.$$('.code-container input'); // <-- array of elements

const code = "999999";


for (let i = 0; i < code.length; i++) {
  await elements[i].type(code[i]);     // <-- No nth(), direct handle
}
//await page.waitForTimeout(1000);
const alert = page.locator('.info.success');
await expect(alert).toBeVisible();
await expect(alert).toContainText('Success');


})

test('Verify account 999', async({page})=>{
  await page.goto("https://qaplayground.dev/apps/verify-account/");
  const number= page.locator('input[type="number"]');
  const fillNumber="999999";
  for (let i = 0 ; i< fillNumber.length;i++){
    await number.nth(i).type(fillNumber[i]);
  }
  await expect(page.getByText('Success')).toBeVisible();
})

test('Tags add delete' , async({page})=>{
  await page.goto('https://qaplayground.dev/apps/tags-input-box/')
  const input = page.locator('ul input');
const tagsToAdd = ["node", "javascript", "qa"];

for (const tag of tagsToAdd) {
    await input.type(tag);
    await input.press('Enter');
}
const tagToDelete = page.locator('ul li', { hasText: "javascript" });
await tagToDelete.locator("i").click();
const tags = page.locator("ul li");
await expect(tags).toHaveCount(2);
await expect(tagToDelete).toHaveCount(0);

//await expect(tags).not.toContainText("javascript");


})




test('Multilevel Dropdown' , async ({page})=>{
  
  await page.goto('https://qaplayground.dev/apps/multi-level-dropdown/')
  const mainDropdown= page.locator('a[href="#home"]').last() // page.locator('.navbar-nav .icon-button')

  mainDropdown.click()


  await page.getByRole('link' , {name: 'My Profile'}).click()

  await expect(page).toHaveURL('https://qaplayground.dev/apps/multi-level-dropdown/#undefined');

  await page.getByRole('link', {name:'Settings'}).click()
  await expect(page).toHaveURL('https://qaplayground.dev/apps/multi-level-dropdown/#settings');

await page.getByRole('link', {name:'HTML'}).click()
 await expect(page).toHaveURL('https://qaplayground.dev/apps/multi-level-dropdown/#!HTML');

 await mainDropdown.click()
 await mainDropdown.click()

 await page.getByRole('link', {name:'Animals'}).click()
 await expect(page).toHaveURL('https://qaplayground.dev/apps/multi-level-dropdown/#animals');

await page.getByRole('link', {name:'Frog'}).click()
await expect(page).toHaveURL('https://qaplayground.dev/apps/multi-level-dropdown/#!Frog');

})

test('New tab' , async({context, page})=>{
  await page.goto('https://qaplayground.dev/apps/new-tab/')

  const pagePromise= context.waitForEvent('page')

  await page.getByRole('link' , {name: 'Open New Tab'}).click()

  const newPage = await pagePromise

  await expect(newPage.getByText('Welcome to the new page!')).toBeVisible()

  await newPage.close();

  await expect(page.getByRole('link' , {name: 'Open New Tab'})).toBeVisible();

  //await page.waitForTimeout(3000)
})

test('New Pop-up' , async({context, page})=>{
  await page.goto('https://qaplayground.dev/apps/popup/');
  const openBtn= page.getByRole('link' , {name:'Open'})
  await expect(openBtn).toBeVisible();
  const popupPromise = page.waitForEvent('popup');
await openBtn.click();
const popup = await popupPromise;
  await expect(popup.getByRole('button' , {name:'Submit'})).toBeVisible();
  await popup.getByRole('button' , {name:'Submit'}).click()

  

  await expect(page.getByText('Button Clicked')).toBeVisible();

})

// test('Draggable Items' , async ({page})=>{
//   await page.goto('https://qaplayground.dev/apps/sortable-list/');

//   const correctOrder = [
//   "Jeff Bezos",
//   "Bill Gates",
//   "Warren Buffett",
//   "Bernard Arnault",
//   "Carlos Slim Helu",
//   "Amancio Ortega",
//   "Larry Ellison",
//   "Mark Zuckerberg",
//   "Michael Bloomberg",
//   "Larry Page"
// ];

// for(let i = 0 ; i < correctOrder.length ; i++){
//  // const person = page.getByText(correctOrder[i]);
//  const person = page.locator('.draggable', { hasText: correctOrder[i] });
//   const orderTarget = page.locator(`li[data-index="${i}"]`);
//   await person.dragTo(orderTarget);
// }

// await page.getByRole('button' , {name: 'Check Order'}).click()
// await expect(page.locator('#draggable-list li.wrong')).toHaveCount(0);

// })



test.use({
  viewport: { width: 1600, height: 1200 },
});

test("Draggable Items", async ({ page }) => {
  await page.goto("https://qaplayground.dev/apps/sortable-list/");

  const correctOrder = [
    "Jeff Bezos",
    "Bill Gates",
    "Warren Buffett",
    "Bernard Arnault",
    "Carlos Slim Helu",
    "Amancio Ortega",
    "Larry Ellison",
    "Mark Zuckerberg",
    "Michael Bloomberg",
    "Larry Page",
  ];

  async function moveToIndex(name, index) {
    const source = page.locator(`div.draggable:has-text("${name}")`);
    const target = page.locator(`li[data-index="${index}"]`);

    await source.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    await source.dragTo(target);

    // confirm the step immediately
    await expect(page.locator("#draggable-list li").nth(index)).toContainText(name);
  }

  for (const [index, name] of correctOrder.entries()) {
    await moveToIndex(name, index);
  }

  await page.locator("#check").click();

  // easiest final assertion
  await expect(page.locator("#draggable-list li.wrong")).toHaveCount(0);
});


test('Nested iframe click', async ({ page }) => {
  await page.goto('https://qaplayground.dev/apps/iframe/');

  await page
    .frameLocator('#frame1')
    .frameLocator('#frame2')
    .getByText('Click Me')
    .click();

  await expect(
    page.frameLocator('#frame1')
        .frameLocator('#frame2')
        .getByText('Button Clicked')
  ).toBeVisible();
})

test('Progress Bar Shadow DOM', async ({ page }) => {
  await page.goto('https://qaplayground.dev/apps/shadow-dom/');

  const bar = page.locator('progress-bar');

  await page.getByRole('button', { name: 'Boost 🚀' }).click();

  await expect(bar).toHaveAttribute('percent', '95', { timeout: 15000 });
});

// test('Rating with image' , async({page})=>{
//   await page.goto('https://qaplayground.dev/apps/rating/')
//   const ratingStars = page.locator('.stars label')
//   const ratingMessages = ['I just hate it' , "I don't like it" , 
//     "This is awesome" , "I just like it" , "I just love it" ];
//   const emojis = page.locator('.emojis img');
//   for(let i = 0 ; i <5 ; i++){
//     await ratingStars.nth(i).click();
//     await expect(page.getByText(ratingMessages[i])).toBeVisible();
//     await expect(page.getByText(`${i+1} out of 5`)).toBeVisible();
//    }
// })

test('Rating with image', async ({ page }) => {
  await page.goto('https://qaplayground.dev/apps/rating/');

  const ratingStars = page.locator('.stars label');
  const message = page.locator('.text');
  const number = page.locator('.numb');
  const emojis = page.locator('.emojis img');

  const ratingMessages = [
    'I just hate it',
    "I don't like it",
    'This is awesome',
    'I just like it',
    'I just love it'
  ];

  for (let i = 0; i < 5; i++) {
    await ratingStars.nth(i).click();

    const messageText = await message.evaluate(el =>
      //give me the style information for the ::before pseudo element
      getComputedStyle(el, '::before').content.replace(/"/g, '')
    );
//take the DOM element `.text` run JavaScript on it inside the browser
    const numberText = await number.evaluate(el =>
      getComputedStyle(el, '::before').content.replace(/"/g, '')
    );

    const emojiSrc = await emojis.nth(i).getAttribute('src');

    expect(messageText).toBe(ratingMessages[i]);
    expect(numberText).toBe(`${i + 1} out of 5`);
    expect(emojiSrc).toContain(`emoji-${i + 1}.png`);
  }
});


})

