# Prettier Ozon Certificate

Утилита для генерации визуально улучшенных подарочных сертификатов Ozon.

## Быстрый старт

1. Установите зависимости:

    ```bash
    npm install
    ```

2. Запустите генератор:

    ```bash
    node generator.js <код_активации> <серийный_номер> [опции]
    ```

    Пример:

    ```bash
    node generator.js XXXX-YYYY-ZZZZ 000-111-222-333-4
    node generator.js XXXX-YYYY-ZZZZ 000-111-222-333-4 --output my-certificate.png --date 01.01.2030
    ```

    **Опции:**
    - `--output`, `-o` — имя выходного файла (по умолчанию: certificate-<timestamp>.png)
    - `--date`, `-d` — дата активации (по умолчанию: 05.03.2027)
    - `--help`, `-h` — показать справку

## Кастомизация

### 1. Замена баннеров

- **Большой баннер (фон hero):**
    - Файл: `assets/banner-big.jpg`
    - Замените изображение на своё, сохранив имя файла или измените путь в CSS (`customizable.css`, переменная `--ozon-banner-big`).

- **Малый баннер (в карточке):**
    - Файл: `assets/banner-small.png`
    - Замените изображение на своё, сохранив имя файла или измените путь в CSS (`customizable.css`, переменная `--ozon-banner-small`).

### 2. Стили текста внутри hero

- Файл: `styles.css`
- Ключевые селекторы:
    - `.hero h1` — заголовок сертификата
    - `.hero-sub` — подзаголовок
    - `.amount` — сумма подарка

Измените стили этих селекторов для кастомизации текста поверх баннера.

### 3. Дополнительные места для кастомизации

- Для удобства кастомизации основных стилей, смотрите файл [`customizable.css`](customizable.css).

## Файл для кастомизации

В проекте есть файл [`customizable.css`](customizable.css), где собраны ключевые места для изменения:

- Баннеры (CSS-переменные)
- Стили текста hero

## Пример кастомизации

```css
/* customizable.css */
:root {
    --ozon-banner-big: url("./assets/banner-big.jpg");
    --ozon-banner-small: url("./assets/banner-small.png");
}

.hero {
    background: var(--ozon-banner-big) no-repeat;
    background-size: cover;
}
.banner-small-img {
    width: 100%;
    height: 120px;
    border-radius: 10px;
    margin-bottom: 15px;
    background-image: var(--ozon-banner-small);
    background-size: cover;
    background-position: center;
}
.hero h1 {
    font-size: 100px;
    font-weight: 700;
    color: #fff;
}
.hero-sub {
    font-size: 24px;
    color: #fff;
}
.amount {
    background: #fff;
    color: #585656;
}
```

---

**Prettier Ozon Certificate** — делайте сертификаты красивыми и уникальными!
