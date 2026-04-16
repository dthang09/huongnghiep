import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://diemthi.tuyensinh247.com/diem-chuan.html';
const OUTPUT_FILE = './src/data/diemchuan.json';

async function runScraper() {
    console.log('Starting scraper...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set a large viewport
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Fetching school list from:', BASE_URL);
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        
        const schoolLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('div.list-schol-box a'));
            return links.map(a => {
                const text = a.innerText.trim();
                // Extract code from text like "KHA - Đại Học Kinh Tế Quốc Dân"
                const codeMatch = text.match(/^([A-Z0-9]{2,6})\s*-\s*/);
                return {
                    href: a.href,
                    text: text,
                    code: codeMatch ? codeMatch[1] : null
                };
            }).filter(s => s.code); // Only process if we have a code
        });

        console.log(`Found ${schoolLinks.length} schools with identified codes.`);

        // START FRESH to ensure no old data remains
        let existingData = {};

        const LIMIT = schoolLinks.length;
        for (let i = 0; i < LIMIT; i++) {
            const school = schoolLinks[i];
            console.log(`[${i + 1}/${LIMIT}] Processing: ${school.code} - ${school.text}`);
            
            try {
                await page.goto(school.href, { waitUntil: 'networkidle2', timeout: 30000 });
                
                const data = await page.evaluate((schoolCode) => {
                    const result = {
                        name: '',
                        scores: []
                    };

                    // Extract name
                    const h1 = document.querySelector('h1')?.innerText || '';
                    result.name = h1.replace(new RegExp(`^${schoolCode}\\s*-\\s*`), '').trim();

                    // Find all potential headers
                    const headers = Array.from(document.querySelectorAll('h3, h2, strong, b, div.title-table'));
                    let targetTable = null;

                    for (const header of headers) {
                        // User wants ONLY THPT 2025, ABSOLUTELY NO Học bạ
                        // Added "kết hợp" and "tổng hợp" for schools like BKU
                        if ((text.includes('điểm thi thpt năm 2025') || 
                             text.includes('điểm xét tuyển kết hợp năm 2025') ||
                             text.includes('điểm chuẩn tổng hợp 2025')) && 
                            !text.includes('học bạ')) {
                            // verify the parent or container doesn't say Học bạ
                            let parent = header.closest('.cutoff-table') || header.parentElement;
                            if (parent.innerText.toLowerCase().includes('học bạ') && !parent.innerText.toLowerCase().includes('điểm thi thpt năm 2025')) {
                                continue;
                            }

                            let table = parent.querySelector('table');
                            
                            if (!table) {
                                // Try following siblings
                                let next = header.nextElementSibling;
                                while (next && !table) {
                                    if (next.tagName === 'TABLE') {
                                        table = next;
                                    } else {
                                        table = next.querySelector('table');
                                    }
                                    next = next.nextElementSibling;
                                    if (next && (next.tagName === 'H3' || next.tagName === 'H2')) break;
                                }
                            }
                            
                            if (table) {
                                // FINAL check on table content: if it mentions Học bạ in first few rows, skip
                                const tableText = table.innerText.toLowerCase();
                                if (tableText.includes('học bạ') && !tableText.includes('thpt')) {
                                   continue;
                                }
                                targetTable = table;
                                break;
                            }
                        }
                    }

                    // Backup: try finding any Ant Design table if we found a good heading but no sibling table
                    if (!targetTable) {
                         targetTable = document.querySelector('.ant-table-content table');
                    }

                    if (targetTable) {
                        const rows = Array.from(targetTable.querySelectorAll('tr'));
                        // Some tables have <thead>, some don't. Skip rows with <th> or header text
                        rows.forEach(row => {
                            const cols = Array.from(row.querySelectorAll('td'));
                            if (cols.length >= 4) {
                                const stt = cols[0]?.innerText.trim();
                                if (stt === 'STT' || isNaN(parseInt(stt))) return; // skip header row if not in <thead>

                                result.scores.push({
                                    "Mã ngành": cols[1]?.innerText.trim() || "",
                                    "Tên ngành": cols[2]?.innerText.trim() || "",
                                    "Tổ hợp môn": cols[3]?.innerText.trim() || "",
                                    "Điểm chuẩn": cols[4]?.innerText.trim() || "",
                                    "Ghi chú": cols[5]?.innerText.trim() || ""
                                });
                            }
                        });
                    }

                    return result;
                }, school.code);

                if (data.scores.length > 0) {
                    existingData[school.code] = {
                        title: `${school.code} - ${data.name || school.text}`,
                        code: school.code,
                        name: data.name || school.text,
                        scores: data.scores
                    };
                    console.log(`Successfully scraped ${data.scores.length} majors for ${school.code}`);
                } else {
                    console.log(`No THPT 2025 scores found for ${school.code}`);
                }

            } catch (err) {
                console.error(`Error scraping ${school.text}:`, err.message);
            }

            // Save periodically every 10 schools
            if (i % 10 === 0) {
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2));
            }
        }

        // Final save
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData, null, 2));
        console.log('Scraping completed. Data saved to:', OUTPUT_FILE);

    } catch (error) {
        console.error('Fatal error during scraping:', error);
    } finally {
        await browser.close();
    }
}

runScraper();
