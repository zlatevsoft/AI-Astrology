# ⚡ Бързо тестване на Stripe

## 🚀 Бързи стъпки (5 минути)

### 1. Проверка на конфигурацията
```bash
# Отиди на тестовата страница
http://localhost:3000/test-stripe

# Натисни "Тествай конфигурация"
# Трябва да покаже ✅
```

### 2. Проверка на връзката
```bash
# Натисни "Тествай връзка"
# Трябва да покаже ✅
```

### 3. Тестване на плащане
```bash
# Натисни "Създай тест"
# Ще отвори Stripe Checkout
# Използвай тестова карта: 4242 4242 4242 4242
```

## 🧪 Тестови карти

### Успешни плащания:
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
```

### Грешки:
```
Declined: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
Lost card: 4000 0000 0000 9987
Stolen card: 4000 0000 0000 9979
```

## 🔧 Environment Variables

Провери `.env.local`:
```env
STRIPE_MODE=test  # или 'live'
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...
STRIPE_SECRET_KEY_LIVE=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🚨 Често срещани проблеми

### "Invalid API key"
- Провери дали ключовете са правилни
- Увери се, че `STRIPE_MODE` е правилен

### "Webhook signature verification failed"
- Провери `STRIPE_WEBHOOK_SECRET`
- Увери се, че webhook URL е правилен

### "Payment failed"
- Използвай правилната тестова карта
- Провери дали имаш достатъчно "тестови пари"

## 📞 Поддръжка

- **Stripe Docs:** https://stripe.com/docs/testing
- **Test Cards:** https://stripe.com/docs/testing#cards
- **Webhooks:** https://stripe.com/docs/webhooks

---

**💡 Съвет:** Винаги тествай първо в test mode преди да преминеш към live!
