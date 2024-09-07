export type ExchangeRateResponse = {
  buy: number;
  sell: number;
  exchange_label: string;
  reference: string | null;
  created_at: string | null;
  currency: string;
  des_currency: string;
  is_main_currency: boolean;
  country_account: string;
};

// export const fetchExchangeRate = async (
//   currency: string,
//   des_currency: string,
// ): Promise<ExchangeRateResponse> => {
//   const response = await fetch(
//     `https://sandbox.efexpay.com/api/public/realtime/rate/?currency=${currency}&des_currency=${des_currency}`,
//     {
//       headers: {
//         "Cache-Control": "no-cache",
//         Accept: "*/*",
//         "Accept-Encoding": "gzip, deflate, br",
//         Connection: "keep-alive",
//         Origin: "https://landing-dev.efexpay.com",
//         "User-Agent": "CustomApp/1.0", // Puede ajustar esto según sea necesario
//       },
//     },
//   );
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };

const BASE_RATES = {
  USD_MXN: 19.5,
  EUR_USD: 1.18,
};

function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getRate(from: string, to: string): number {
  if (from === to) return 1;
  const key = `${from}_${to}` as keyof typeof BASE_RATES;
  if (key in BASE_RATES) return BASE_RATES[key];
  const inverseKey = `${to}_${from}` as keyof typeof BASE_RATES;
  if (inverseKey in BASE_RATES) return 1 / BASE_RATES[inverseKey];

  // Para tasas cruzadas (e.g., EUR/MXN), calculamos a través de USD
  if (from !== "USD" && to !== "USD") {
    return getRate(from, "USD") * getRate("USD", to);
  }

  throw new Error(`No exchange rate found for ${from} to ${to}`);
}

export const fetchExchangeRate = async (
  currency: string,
  des_currency: string,
): Promise<ExchangeRateResponse> => {
  // Simulamos una llamada a API con un delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return new Promise((resolve) => {
    const baseRate = getRate(currency, des_currency);
    const spread = 0.04; // 4% spread

    const variation = 1 + (Math.random() - 0.5) * 0.01;
    const adjustedBaseRate = baseRate * variation;

    let buy: number, sell: number;
    let isMainCurrency: boolean;

    if (currency === "EUR" || (currency === "USD" && des_currency !== "EUR")) {
      isMainCurrency = true;
      buy = roundToTwo(adjustedBaseRate * (1 - spread / 2));
      sell = roundToTwo(adjustedBaseRate * (1 + spread / 2));
    } else {
      isMainCurrency = false;
      buy = roundToTwo((1 / adjustedBaseRate) * (1 + spread / 2));
      sell = roundToTwo((1 / adjustedBaseRate) * (1 - spread / 2));
    }

    const exchangeLabel = isMainCurrency
      ? `1 ${currency} = $ ${buy} ${des_currency}`
      : `1 ${des_currency} = $ ${buy} ${currency}`;

    resolve({
      buy,
      sell,
      reference: null,
      created_at: new Date().toISOString(),
      currency,
      des_currency,
      exchange_label: exchangeLabel,
      is_main_currency: isMainCurrency,
      country_account: "USA",
    });
  });
};
