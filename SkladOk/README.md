# SkladOk — landing page

Статичний лендинг для iOS-застосунку **SkladOk** (мобільний складський облік
для малого бізнесу). Англійська — головна мова, українська — у `/uk/`,
російська — у `/ru/`, іспанська — у `/es/`. Дизайн «Тихий порядок».

## Запуск локально

```bash
cd web
python3 -m http.server 8000
```

Відкрийте `http://127.0.0.1:8000/`.

## Структура

- `index.html` — англійська версія (головна), SEO/OG/Twitter-метадані, JSON-LD.
- `uk/index.html` — українська версія з тими самими стилями й скриптами.
- `ru/index.html` — російська версія з тими самими стилями й скриптами.
- `es/index.html` — іспанська версія з тими самими стилями й скриптами.
- `en/index.html` — редирект на головну для старих посилань `/en/`.
- `privacy.html` — Privacy Policy, лише англійською.
- `terms.html` — Terms of Service, лише англійською.
- `support.html` — сторінка підтримки з повноекранною формою Microsoft Forms, лише англійською.
- `styles.css` — дизайн-система, адаптивність, анімації, стилі правових сторінок.
- `main.js` — меню, scroll spy, reveal-анімації, паралакс, галерея.
- `assets/screens/` — реальні екрани застосунку з українським інтерфейсом
  в AVIF/WebP/PNG (варіанти 540, 720 і 1080 px для `srcset`).
- `assets/screens/en/` — ті самі екрани з англійським інтерфейсом для
  англійської версії лендінгу.
- `assets/screens/ru/` — екрани з російським інтерфейсом для `/ru/`.
- `assets/screens/es/` — екрани з іспанським інтерфейсом для `/es/`.
- `assets/brand/` — іконка, логотипи, favicon, OG-зображення для чотирьох мов.
- `assets/fonts/` — self-hosted Inter та Inter Tight (WOFF2).
- `robots.txt`, `sitemap.xml` — для `https://kranus.com/SkladOk/` (EN), `/uk/` (UA), `/ru/` (RU), `/es/` (ES), `support.html`, `privacy.html` і `terms.html`.

Мовна версія перемикається кнопками `UA / EN / RU / ES` у хедері. Головна
сторінка — англійська (`/`), українська — `/uk/`, російська — `/ru/`,
іспанська — `/es/`. Англійська використовує `assets/`, `styles.css` і
`main.js` з кореня; українська, російська та іспанська — ті самі файли
через `../`. Українська версія показує українські екрани, англійська —
англійські, російська — російські, іспанська — іспанські. Українські ціни
на екранах — у **₴ (UAH)**, англійські, російські та іспанські — у
**$ (USD)**. Джерела фреймів — `../design/SkladOk.en.fig`,
`../design/SkladOk.ru.fig` і `../design/SkladOk.es.fig` (копії вихідного
`SkladOk.fig`).

Після заміни будь-якого скріншота оновіть версію `?v=...` біля його URL
у `index.html`, `uk/index.html`, `ru/index.html` або `es/index.html`
(і `styles.css` / `main.js`), щоб браузери не показували закешоване старе
зображення.

## Форма підтримки

`support.html` — повноекранний `<iframe>` з формою Microsoft Forms:
`https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAARnEBc9UMzZaM05WWFQ3M0RFNEZMRzIzTlAwSDNFRy4u`.
Форма збирає ім'я, тип звернення, текст відгуку, версію застосунку, email
і згоду. Дані обробляє Microsoft Forms; це розкрито в Privacy Policy.

## Перед публікацією

1. **App Store.** URL уже вказано як
   `https://apps.apple.com/app/id6834417596` (ID з App Store Connect). У кожній
   мовній версії він зустрічається 5 разів (позначки `data-app-store-link`).
   Застосунок ще не опубліковано, тому до релізу посилання може показувати
   сторінку з помилкою; після публікації воно запрацює без змін на сайті.
2. **Правові сторінки.** `privacy.html` і `terms.html` уже додані та
   підключені з усіх чотирьох мовних версій. Документи доступні лише
   англійською; підписи посилань у футері залишаються локалізованими.
   Перед публікацією перевірте, що дати `Effective` / `Last updated`
   відповідають даті публікації, а текст описує фактичний стан застосунку
   (Firebase Analytics, IDFA/ATT, перемикач аналітики). Тексти варто
   показати юристу, особливо розділи про IDFA/ATT, consent, transfers і
   нейтральне регулювання спорів.
3. **Форма підтримки.** `support.html` вбудовує Microsoft Forms. Перевірте,
   що у формі вказано правильний текст згоди та посилання на
   `https://kranus.com/SkladOk/privacy.html` (не `/policy`). Форма робить
   сторонні запити до Microsoft; це розкрито в Privacy Policy.
4. **Домен.** Якщо фінальна адреса відрізняється від
   `https://kranus.com/SkladOk/`, оновіть `canonical`, `og:url`, `og:image`,
   `twitter:image`, `hreflang`, `robots.txt` і `sitemap.xml` у всіх мовних
   версіях. Якщо сайт живе в підкаталозі `/SkladOk/`, `robots.txt` бажано
   продублювати в корені `kranus.com` або додати посилання на sitemap у
   кореневий `robots.txt`.
5. **OG-зображення.** За потреби перегенеруйте
   `assets/brand/og-image.png`, `og-image-en.png`, `og-image-ru.png` та
   `og-image-es.png` (1200×630).

Підтримка: `support@kranus.com`.

## Перевірено

- Реальні екрани застосунку, без вигаданих відгуків, статистики чи рейтингів.
- Lighthouse (Chromium, simulated mobile, gzip + cache headers): Performance 98,
  Accessibility 100, Best Practices 100, SEO 100 в усіх чотирьох версіях.
  FCP 1.4 s, LCP 2.3 s, CLS 0, TBT 0 ms.
- Lighthouse для `privacy.html` і `terms.html`: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100.
- `support.html`: повноекранний iframe Microsoft Forms завантажується
  (заголовок і поля форми доступні), сторінка адаптивна на 1440/768/375/320 px,
  без горизонтального скролу; `<noscript>` показує посилання на форму.
  Lighthouse для цієї сторінки не запускався: вона містить лише
  cross-origin iframe, тому Lighthouse не фіксує FCP.
- axe-core: 0 порушень (WCAG 2.1 AA + best practices) в усіх чотирьох версіях
  та на сторінках `privacy.html`, `terms.html`, `support.html`.
- Усі внутрішні посилання на семи сторінках повертають 200; усі 7 URL із
  `sitemap.xml` доступні; JSON-LD парситься без помилок.
- Усі 16 правових placeholder-посилань замінені; App Store URL вказано як
  `https://apps.apple.com/app/id6834417596` (застосунок ще не опубліковано).
- CLS 0; усі зображення мають `width`/`height` і адаптивний `srcset`.
- Валюта за замовчуванням — валюта регіону пристрою; на UA-екранах показано
  ₴ (UAH), на EN-, RU- та ES-екранах — $ (USD).
- Підтримка `prefers-reduced-motion`, клавіатурна навігація, focus trap у
  мобільному меню.
