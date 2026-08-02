// 綠界 ECPay 測試環境付款 Demo
// 跑法: node server.js → 瀏覽器開 http://localhost:3000 → 按「付款」
const http = require("http");
const crypto = require("crypto");

const MERCHANT_ID = "2000132";
const HASH_KEY = "5294y06JbISpM5x9";
const HASH_IV = "v77hoKGq4kWxNNIS";

const ECPAY_URL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";

// 綠界規定的 URL encode 規則(.NET 樣式)
function urlEncodeDotNet(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");
}

// 計算檢查碼 CheckMacValue
function checkMacValue(params) {
  const sorted = Object.keys(params).sort();
  const query = sorted.map((k) => `${k}=${params[k]}`).join("&");
  const raw = `HashKey=${HASH_KEY}&${query}&HashIV=${HASH_IV}`;
  // 必須先轉小寫再做 SHA256
  const encoded = urlEncodeDotNet(raw).toLowerCase();
  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

function tradeDate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function buildPayment() {
  const params = {
    MerchantID: MERCHANT_ID,
    MerchantTradeNo: "CAMP" + Date.now(),
    MerchantTradeDate: tradeDate(),
    PaymentType: "aio",
    TotalAmount: "100",
    TradeDesc: "vibe coding camp test",
    ItemName: "Vibe Coding 專案 x 1",
    ReturnURL: "https://example.com/payment-result",
    ChoosePayment: "Credit",
    EncryptType: "1",
  };
  params.CheckMacValue = checkMacValue(params);
  return params;
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/pay") {
    const params = buildPayment();
    const inputs = Object.entries(params)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}">`)
      .join("\n");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
<html lang="zh-TW">
<body>
  <p>導向綠界付款頁中…</p>
  <form id="ecpay" method="POST" action="${ECPAY_URL}">
${inputs}
  </form>
  <script>document.getElementById("ecpay").submit();</script>
</body>
</html>`);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>我的作品集 - 付款</title>
  <style>
    body { font-family: "Microsoft JhengHei", sans-serif; max-width: 420px; margin: 80px auto; text-align: center; }
    h1 { color: #4f46e5; }
    .price { font-size: 28px; margin: 24px 0; }
    button { font-size: 20px; padding: 10px 32px; background: #4f46e5; color: #fff; border: none; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Vibe Coding 專案</h1>
  <div class="price">NT$ 100</div>
  <form method="POST" action="/pay">
    <button type="submit">付款</button>
  </form>
</body>
</html>`);
});

server.listen(3000, () => {
  console.log("開好了:http://localhost:3000");
});