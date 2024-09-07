import Mexico from "../assets/mexico.svg";
import USA from "../assets/usa.svg";
import Eur from "../assets/eur.svg";

export const DEFAULT_CURRENCY_PRECISION = 2;
const localization = {
  languageCode: "en-US",
  countryCode: "USD",
};

export const isNumber = (value: string | number | boolean | null | undefined) =>
  typeof value === "number" && value === value;

export const currency = (
  number: number | string | null | undefined,
  minimumFractionDigits = DEFAULT_CURRENCY_PRECISION,
  maximumFractionDigits = DEFAULT_CURRENCY_PRECISION,
  withDeltaSign = false,
): string => {
  let finalNumber = number;
  if (typeof number === "string") {
    finalNumber = parseFloat(number);
  }

  if (!isNumber(finalNumber)) {
    return "$0.00";
  }

  return new Intl.NumberFormat(localization.languageCode, {
    style: "currency",
    currency: localization.countryCode,
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay: withDeltaSign ? "exceptZero" : "auto",
  }).format(finalNumber as number);
};

export const OPTIONS_FOR_CONVERTER = [
  {
    value: "MXN",
    label: "MXN",
    icon: Mexico,
    alt: "Mexico flag",
    text: "Pesos mexicanos",
  },
  {
    value: "USD",
    label: "USD",
    icon: USA,
    alt: "USA flag",
    text: "USD dólares",
  },
  { value: "EUR", label: "EUR", icon: Eur, alt: "Euro flag", text: "Euros" },
];

export const OPTIONS_OBJECT_FOR_CONVERTER = OPTIONS_FOR_CONVERTER.reduce(
  (acc, option) => {
    acc[option.value] = option;
    return acc;
  },
  {} as Record<
    string,
    { value: string; label: string; icon: string; alt: string; text: string }
  >,
);
