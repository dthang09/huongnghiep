import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function testScrape() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = 'https://diemthi.tuyensinh247.com/diem-chuan/dai-hoc-kinh-te-quoc-dan-kha-c2.html';
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const $ = cheerio.load(html);
    await browser.close();

    const result = {
        name: $('.title-school').text().trim(),
        scores: []
    };

    // Find the section for THPT 2025
    // Looking for a header or div that contains the text
    $('strong, h2, h3').each((i, el) => {
        const text = $(el).text();
        if (text.includes('Điểm chuẩn theo phương thức Điểm thi THPT năm 2025')) {
            const table = $(el).closest('div').find('table');
            if (table.length === 0) {
              // try next sibling
              $(el).parent().nextAll('table').first().each((j, tableEl) => {
                  parseTable($(tableEl), result.scores);
              });
            } else {
              parseTable(table, result.scores);
            }
        }
    });

    console.log(JSON.stringify(result, null, 2));
}

function parseTable(table, scores) {
    const rows = table.find('tr').slice(1); // skip header
    rows.each((i, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 4) {
            scores.push({
                "Mã ngành": $(cols[1]).text().trim(),
                "Tên ngành": $(cols[2]).text().trim(),
                "Tổ hợp môn": $(cols[3]).text().trim(),
                "Điểm chuẩn": $(cols[4]).text().trim(),
                "Ghi chú": $(cols[5]) ? $(cols[5]).text().trim() : ""
            });
        }
    });
}

testScrape();
