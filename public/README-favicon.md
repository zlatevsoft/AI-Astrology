# AI Astrology Favicon

## Описание
Стилна favicon с астрологически дизайн, създадена специално за AI Astrology приложението.

## Файлове
- `favicon.svg` - Основна SVG favicon (32x32)
- `favicon-large.svg` - По-голяма версия с повече детайли (64x64)
- `safari-pinned-tab.svg` - Монохромна версия за Safari pinned tabs
- `favicon.ico` - ICO файл (placeholder)
- `icon-16x16.png` - PNG версия 16x16 (placeholder)
- `icon-32x32.png` - PNG версия 32x32 (placeholder)
- `apple-touch-icon.png` - Apple touch icon 180x180 (placeholder)

## Дизайн елементи
- 🌟 Космически градиент фон (синьо-лилаво-розово)
- ⭐ Централна звезда с градиент
- 🌙 Планетарни символи (Слънце, Луна, Венера, Марс)
- ♈ Зодиакални символи (Овен, Рак, Везни, Козирог)
- ✨ Малки звездички около кръга
- 🔵 Зодиакални кръгове за структура

## Генериране на PNG версии
За да генерирате PNG версии от SVG файловете:

### Онлайн инструменти:
1. https://convertio.co/svg-png/
2. https://cloudconvert.com/svg-to-png
3. https://www.svgviewer.dev/

### Команден ред (ако имате ImageMagick):
```bash
convert favicon.svg favicon.png
convert favicon-large.svg -resize 32x32 icon-32x32.png
convert favicon-large.svg -resize 16x16 icon-16x16.png
convert favicon-large.svg -resize 180x180 apple-touch-icon.png
```

### За ICO файл:
```bash
convert favicon-large.svg -resize 16x16 favicon.ico
```

## Цветове
- Основен градиент: #667eea → #764ba2 → #f093fb
- Звезди: #ffffff → #fbbf24 → #f59e0b
- Бяла рамка: #ffffff
- Прозрачност: rgba(255,255,255,0.2-0.9)

## Съвместимост
- ✅ Всички модерни браузъри
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ PWA manifest
- ✅ Safari pinned tabs
