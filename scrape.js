const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  const seeds = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    console.log(`Scraping: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');

    // Extract all numbers from all table cells
    const numbers = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll('table td, table th'));
      const nums = [];
      for (const cell of cells) {
        const text = cell.innerText.trim();
        // Match integers and decimals (including negative numbers if present)
        const matches = text.match(/-?\d+(\.\d+)?/g);
        if (matches) {
          matches.forEach(numStr => nums.push(parseFloat(numStr)));
        }
      }
      return nums;
    });

    const pageSum = numbers.reduce((acc, curr) => acc + curr, 0);
    console.log(`Seed ${seed} sum: ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log(`========================================`);
  console.log(`TOTAL SUM ACROSS ALL SEEDS: ${grandTotal}`);
  console.log(`========================================`);

  await browser.close();
})();
