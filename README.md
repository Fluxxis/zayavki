# Web-App (Telegram Mini App)

## Что внутри
- `index.html` — страница
- `css/style.css` — стили
- `js/app.js` — логика, анимации, отправка уведомления в Discord
- `js/config.js` — настройки (Webhook и ссылка на бот)
- `images/avatar.png` — аватар (замени на свой)

## Как включить уведомление в Discord
Открой `js/config.js` и вставь свой webhook URL:
```js
DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/.../..."
```

Сообщение приходит от имени **"Заявки"**, без аватарки.

## Как открыть переход на бота
В `js/config.js` поменяй:
```js
TARGET_BOT_LINK: "https://t.me/IpachiBot?start=7225974704"
```

## Хостинг
Это статический сайт. Подходит Vercel / Netlify / Cloudflare Pages / GitHub Pages.
Важно: **только HTTPS**.

## Важно про безопасность
- Не вставляй токен Telegram-бота в web-app.
- Web-app — публичный фронт. Всё “секретное” должно быть на сервере/в боте.
