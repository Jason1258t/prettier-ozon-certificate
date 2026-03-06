const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

// Читаем аргументы командной строки
const args = process.argv.slice(2);
const usage = `
Использование: node generator.js <код_активации> <серийный_номер> [опции]

Пример:
  node generator.js MDP7-VK87-7X3 109-984-584-788-0
  node generator.js MDP7-VK87-7X3 109-984-584-788-0 --output my-certificate.png --date 31.12.2025

Опции:
  --output, -o    Имя выходного файла (по умолчанию: certificate-<timestamp>.png)
  --date, -d      Дата активации (по умолчанию: 05.03.2027)
  --help, -h      Показать эту справку
`;

// Парсим аргументы
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

let activationCode = '';
let serialNumber = '';
let outputFile = '';
let activationDate = '05.03.2027';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' || args[i] === '-o') {
    outputFile = args[++i];
  } else if (args[i] === '--date' || args[i] === '-d') {
    activationDate = args[++i];
  } else if (!activationCode) {
    activationCode = args[i];
  } else if (!serialNumber) {
    serialNumber = args[i];
  }
}

if (!activationCode || !serialNumber) {
  console.error('Ошибка: Необходимо указать код активации и серийный номер');
  console.log(usage);
  process.exit(1);
}

// Формируем имя выходного файла
if (!outputFile) {
  const timestamp = Date.now();
  outputFile = `output/certificate-${timestamp}.png`;
}

// Путь к HTML-шаблону
const templatePath = path.join(__dirname, 'certificate.html');

async function generateCertificate() {
  let browser = null;
  
  try {
    // Читаем HTML-шаблон
    console.log('📄 Чтение шаблона...');
    let html = await fs.readFile(templatePath, 'utf-8');

    // Подставляем данные
    console.log('🔧 Подстановка данных...');
    console.log(`   Код активации: ${activationCode}`);
    console.log(`   Серийный номер: ${serialNumber}`);
    console.log(`   Дата активации: ${activationDate}`);

    html = html
      .replace(/MDP7-VK87-7X3/g, activationCode)
      .replace(/109-984-584-788-0/g, serialNumber)
      .replace(/05\.03\.2027/g, activationDate);

    // Сохраняем временный HTML-файл
    const tempHtmlPath = path.join(__dirname, 'temp-certificate.html');
    await fs.writeFile(tempHtmlPath, html);
    console.log('📝 Временный HTML создан');

    // Запускаем браузер
    console.log('🌐 Запуск браузера...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Устанавливаем размер viewport для хорошего качества
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // Для лучшего качества
    });

    // Загружаем страницу
    console.log('📄 Загрузка страницы...');
    await page.goto(`file://${tempHtmlPath}`, {
      waitUntil: 'networkidle0'
    });

    // Ждем загрузки всех ресурсов (исправлено: используем setTimeout вместо waitForTimeout)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Делаем скриншот
    console.log('📸 Создание скриншота...');
    
    // Находим контейнер и делаем скриншот только его
    const container = await page.$('.container');
    if (container) {
      await container.screenshot({
        path: outputFile,
        type: 'png',
        omitBackground: false
      });
      console.log(`✅ Скриншот сохранен: ${outputFile}`);
    } else {
      // Если не нашли контейнер, делаем скриншот всей страницы
      await page.screenshot({
        path: outputFile,
        fullPage: true,
        type: 'png'
      });
      console.log(`✅ Скриншот всей страницы сохранен: ${outputFile}`);
    }

    // Удаляем временный файл
    await fs.remove(tempHtmlPath);
    console.log('🧹 Временные файлы удалены');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Запускаем генерацию
generateCertificate();