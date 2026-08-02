// 綠界 ECPay 測試環境付款 Demo
// 跑法: node server.js → 瀏覽器開 http://localhost:3000 → 按「付款」
const http = require("http");
const crypto = require("crypto");

const MERCHANT_ID = "2000132";
const HASH_KEY = "5294y06JbISpM5x9";
const HASH_IV = "v77hoKGq4kWxNNIS";

const ECPAY_URL = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
const PORT = 3000;

/**
 * 綠界規定的 URL encode 規則 (.NET 樣式 + 小寫 HEX)
 * 1. encodeURIComponent 轉碼
 * 2. %20 轉為 +
 * 3. 轉義符號替換 ( ! ( ) * ' ~ )
 * 4. 將 %XX 中的英文字母轉為小寫
 */
function urlEncodeDotNet(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*")
    .replace(/%27/g, "'")
    .replace(/%7e/g, "~")
    .replace(/%[0-9A-F]{2}/g, (match) => match.toLowerCase());
}

/**
 * 計算綠界交易檢查碼 CheckMacValue
 */
function checkMacValue(params) {
  // 1. 依鍵值進行 Alphabet 排序
  const sorted = Object.keys(params).sort();
  const query = sorted.map((k) => `${k}=${params[k]}`).join("&");

  // 2. 組合 HashKey 與 HashIV
  const raw = `HashKey=${HASH_KEY}&${query}&HashIV=${HASH_IV}`;

  // 3. 進行綠界規範的 URL encode
  const encoded = urlEncodeDotNet(raw);

  // 4. SHA256 加密並轉大寫
  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

/**
 * 產生符合綠界格式的交易時間 (YYYY/MM/DD HH:mm:ss)
 */
function tradeDate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/**
 * 建立付款參數物件
 */
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

server.listen(PORT, () => {
  console.log("==========================================");
  console.log(`🚀 綠界付款 Demo 伺服器啟動完成：http://localhost:${PORT}`);
  console.log("==========================================");
});