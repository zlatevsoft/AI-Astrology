# 🚀 Ръководство за преминаване към реалния Stripe режим

## 📋 Предварителни изисквания

### 1. Stripe Account Setup
- ✅ Имаш активен Stripe account
- ✅ Account-ът е верифициран
- ✅ Плащанията са активирани (`charges_enabled: true`)
- ✅ Payouts са конфигурирани

### 2. Business Information
- ✅ Business details са попълнени
- ✅ Bank account е свързан
- ✅ Tax information е предоставена

## 🔧 Стъпки за конфигуриране

### Стъпка 1: Вземане на реалните API ключове

1. **Влез в [Stripe Dashboard](https://dashboard.stripe.com)**
2. **Отиди в Developers → API keys**
3. **Копирай реалните ключове:**
   ```
   Publishable key: pk_live_...
   Secret key: sk_live_...
   ```

### Стъпка 2: Конфигуриране на environment variables

Актуализирай `.env.local` файла:

```env
# Stripe Configuration
STRIPE_MODE=live
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_your_actual_live_key
STRIPE_SECRET_KEY_LIVE=sk_live_your_actual_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Стъпка 3: Създаване на Webhook

1. **В Stripe Dashboard отиди в Developers → Webhooks**
2. **Натисни "Add endpoint"**
3. **Въведи URL:** `https://yourdomain.com/api/webhook/stripe`
4. **Избери събитията:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
5. **Копирай webhook secret** и го добави в environment variables

### Стъпка 4: Тестване на конфигурацията

1. **Отиди на:** `https://yourdomain.com/test-stripe`
2. **Натисни "Тествай конфигурация"** - трябва да покаже ✅
3. **Натисни "Тествай връзка"** - трябва да покаже ✅
4. **Натисни "Създай тест"** - трябва да отвори Stripe Checkout

## 🧪 Безопасно тестване в реална среда

### Вариант 1: Тестови карти (Препоръчан)
Използвай тестови карти, които не взимат истински пари:

```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
```

**Тестови карти за различни сценарии:**
- `4000 0000 0000 0002` - Declined карта
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 9987` - Lost карта
- `4000 0000 0000 9979` - Stolen карта

### Вариант 2: Минимални суми
За първоначално тестване използвай минимални суми:
- Basic: $0.01 (1 cent)
- Detailed: $0.02 (2 cents)
- Comprehensive: $0.03 (3 cents)

### Вариант 3: Refund тестване
След успешно плащане можеш да тестваш refunds:
1. **В Stripe Dashboard отиди в Payments**
2. **Намери плащането**
3. **Натисни "Refund"**
4. **Провери дали webhook-ът получава събитието**

## 🔍 Мониторинг и логове

### Stripe Dashboard
- **Payments** - всички транзакции
- **Logs** - API заявки и грешки
- **Webhooks** - webhook доставки
- **Customers** - клиентска информация

### Application Logs
Проверявай логовете за:
```bash
# Development
npm run dev

# Production (ако използваш Vercel)
vercel logs
```

### Webhook Testing
Използвай Stripe CLI за тестване на webhooks локално:
```bash
# Инсталирай Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## ⚠️ Важни предупреждения

### 1. Безопасност
- **НИКОГА** не споделяй secret keys
- Използвай HTTPS в production
- Проверявай webhook signatures
- Валидирай всички входни данни

### 2. Тестване
- **ВИНАГИ** тествай първо в test mode
- Използвай тестови карти за първоначално тестване
- Проверявай всички edge cases
- Тествай error scenarios

### 3. Compliance
- Спазвай PCI DSS изискванията
- Не съхранявай credit card данни
- Използвай Stripe Elements за security
- Спазвай GDPR изискванията

## 🚨 Често срещани проблеми

### 1. "Invalid API key"
- Провери дали използваш правилните ключове
- Увери се, че `STRIPE_MODE=live`
- Провери дали account-ът е активен

### 2. "Webhook signature verification failed"
- Провери `STRIPE_WEBHOOK_SECRET`
- Увери се, че webhook URL е правилен
- Провери дали използваш HTTPS

### 3. "Payment failed"
- Провери дали картата е валидна
- Увери се, че има достатъчно средства
- Провери дали картата не е блокирана

### 4. "Account not activated"
- Попълни business information
- Свържи bank account
- Изчакай верификацията

## 📞 Поддръжка

### Stripe Support
- **Email:** support@stripe.com
- **Documentation:** https://stripe.com/docs
- **Status page:** https://status.stripe.com

### Полезни ресурси
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Security Best Practices](https://stripe.com/docs/security)

## ✅ Checklist за преминаване

- [ ] Stripe account е верифициран
- [ ] API ключовете са конфигурирани
- [ ] Webhook е създаден и тестван
- [ ] Environment variables са зададени
- [ ] Конфигурацията е тествана
- [ ] Връзката работи
- [ ] Тестови плащания минават
- [ ] Webhook събития се получават
- [ ] Error handling е тестван
- [ ] Logging е конфигуриран
- [ ] Monitoring е настроен

## 🎯 Следващи стъпки

1. **Мониторинг** - следя транзакциите
2. **Analytics** - анализирам данните
3. **Optimization** - оптимизирам процеса
4. **Scaling** - мащабирам при нужда

---

**⚠️ Важно:** Този преход е необратим за production. Увери се, че всичко е тествано преди да активираш реалните плащания!
