# Real-Time Visitor Counter Microservice

Herhangi bir web sitesine kolayca eklenebilen, gerçek zamanlı ziyaretçi sayacı mikroservisi. Socket.io ve Express.js kullanarak aktif ziyaretçi sayınızı takip eder.

![Visitor Counter Demo](https://via.placeholder.com/600x300.png?text=Visitor+Counter+Demo)

## 🚀 Özellikler

- **Gerçek Zamanlı Takip**: Aktif ziyaretçi sayısını anlık olarak günceller
- **Kolay Entegrasyon**: Tek bir script ekleyerek herhangi bir web sitesine kolayca entegre edilir
- **Özelleştirilebilir Görünüm**: Renk, pozisyon, metin ve dil seçenekleri
- **Çift Yönlü İletişim**: WebSocket ile gerçek zamanlı iletişim
- **API Desteği**: REST API ile ziyaretçi sayısına erişim
- **Docker Desteği**: Kolay deployment için Docker entegrasyonu

## 🔧 Kurulum

### Docker ile Kurulum (Önerilen)

```bash
# Repoyu klonlayın
git clone https://github.com/dogukanakinn/visitor-counter-microservice.git
cd visitor-counter-microservice

# Docker ile çalıştırın
docker-compose up -d
```

### Manuel Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/dogukanakinn/visitor-counter-microservice.git
cd visitor-counter-microservice

# Bağımlılıkları yükleyin
npm install

# .env dosyasını düzenleyin
cp .env.example .env

# Geliştirme modunda başlatın
npm run dev

# veya
# Üretime hazır derleyin ve başlatın
npm run build
npm start
```

## 🧩 Web Sitenize Entegrasyon

Visitor Counter'ı web sitenize entegre etmenin en kolay yolu aşağıdaki scripti eklemektir:

### 1. Tek Script Entegrasyonu (En Kolay)

```html
<!-- Visitor Counter entegrasyonu -->
<script src="https://visitors.studyaitool.com/client.js"></script>
```

Bu script, web sayfanızın sağ alt köşesine otomatik olarak bir ziyaretçi sayacı ekleyecektir.

### 2. Özelleştirilmiş Entegrasyon

config parametrelerini düzenleyerek sayacın görünümünü ve davranışını özelleştirebilirsiniz:

```html
<script>
  // Visitor Counter konfigürasyonu
  window.visitorCounterConfig = {
    position: 'top-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: 'white',
    language: 'tr', // 'en' veya 'tr'
    hideAfterSeconds: 5, // 5 saniye sonra gizle (0 = her zaman göster)
  };
</script>
<script src="https://visitors.studyaitool.com/client.js"></script>
```

### 3. Kendi Elementiniz İçine Entegre Edin

```html
<!-- Ziyaretçi sayacını göstermek istediğiniz div -->
<div id="visitor-counter"></div>

<script>
  // Bu ID'yi kullanarak kendi elementinize entegre edin
  window.visitorCounterConfig = {
    useExistingElement: true,
    // Diğer özelleştirmeler...
  };
</script>
<script src="https://visitors.studyaitool.com/client.js"></script>
```

## 📚 API Referansı

### WebSocket Olayları

Visitor Counter servisi, WebSocket üzerinden aşağıdaki olayları yayınlar:

- `visitor-count`: Ziyaretçi sayısı değiştiğinde yayınlanır
  ```js
  // Örnek veri
  { count: 5 }
  ```

### REST API Endpoints

- `GET /api/visitors`: Mevcut ziyaretçi sayısını döndürür
  ```json
  { "count": 5 }
  ```

- `GET /api/visitors/details`: Bağlı ziyaretçiler hakkında detaylı bilgi verir
  ```json
  {
    "count": 5,
    "clients": [
      {
        "id": "socket-id-1",
        "ip": "127.0.0.1",
        "connectionTime": "2023-03-26T12:30:45.123Z",
        "lastActive": "2023-03-26T12:35:45.123Z"
      },
      // ...
    ]
  }
  ```

## 🚀 Deployment

### Önerilen Servisler

- [Railway](https://railway.app)
- [Render](https://render.com)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform/)
- [Heroku](https://heroku.com)
- Kendi VPS veya Sunucu çözümleriniz

### Docker Deployment

```bash
# Docker imajı oluşturun
docker build -t visitor-counter .

# Imajı çalıştırın
docker run -p 5001:5001 -e PORT=5001 -e ALLOWED_ORIGINS=https://yourwebsite.com visitor-counter
```

## 📝 Lisans

MIT

---

Geliştirici: [Your Name](https://github.com/yourusername)  
Proje: [GitHub Repository](https://github.com/yourusername/visitor-counter) 




