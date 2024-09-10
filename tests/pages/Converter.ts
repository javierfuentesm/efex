import { expect, type Locator, type Page } from "@playwright/test";

export class ConverterPage {
  readonly page: Page;
  readonly url: string;
  readonly gettingStartedHeader: Locator;
  readonly conversionButton: Locator;
  readonly fromInput: Locator;
  readonly toInput: Locator;
  readonly emptyConversionText: Locator;
  readonly timerRefreshInterval: Locator;
  readonly invertOrderButton: Locator;
  readonly conversionHistoryTable: Locator;
  readonly fromCurrencyInput: Locator;
  readonly toCurrencyInput: Locator;
  readonly fromCurrencySelect: Locator;
  readonly toCurrencySelect: Locator;
  readonly optionsContainer: Locator;
  readonly loadingSpinner: Locator;
  readonly fromCurrencySelectArrow: Locator;
  readonly toCurrencySelectArrow: Locator;
  readonly exchangeRateText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = "/";
    this.gettingStartedHeader = page.getByRole("heading", {
      name: "Convertir",
    });
    this.conversionButton = page.getByRole("button", {
      name: "Realizar conversión",
    });
    this.fromInput = page.getByTestId("currency-input-from");
    this.toInput = page.getByTestId("currency-input-to");
    this.emptyConversionText = page.getByText("Total convertido$0.00 MXN");
    this.timerRefreshInterval = page.getByText(
      "Las tarifas se actualizarán en",
    );
    this.invertOrderButton = page.getByRole("button", {
      name: "Invertir orden",
    });
    this.conversionHistoryTable = page.getByRole("table");
    this.fromCurrencyInput = page.getByTestId("currency-input-from");
    this.toCurrencyInput = page.getByTestId("currency-input-to");
    this.fromCurrencySelect = page.getByTestId("currency-wrapper-from");
    this.toCurrencySelect = page.getByTestId("currency-wrapper-to");
    this.optionsContainer = page.getByRole("listbox");
    this.loadingSpinner = page
      .locator("div")
      .filter({ hasText: /^Loading\.\.\.$/ })
      .first();
    this.fromCurrencySelectArrow = page
      .getByTestId("currency-wrapper-from")
      .locator("svg");
    this.toCurrencySelectArrow = page
      .getByTestId("currency-wrapper-to")
      .locator("svg");
    this.exchangeRateText = page.getByTestId("exchange-rate");
  }

  goto() {
    return this.page.goto(this.url);
  }

  async validatePage() {
    await expect(this.gettingStartedHeader).toBeVisible();
    await expect(this.conversionButton).toBeVisible();
    await expect(this.fromInput).toBeVisible();
    await expect(this.toInput).toBeVisible();
    await expect(this.toInput).toHaveValue("");
    await expect(this.conversionButton).toBeDisabled();
    await expect(this.emptyConversionText).toBeVisible();
    await expect(this.timerRefreshInterval).not.toBeVisible();
    await expect(this.invertOrderButton).toBeVisible();
  }

  fillFromInput(value: string) {
    return this.fromInput.fill(value);
  }

  async validateConversionOccurred() {
    //validate that the to input is not empty or 0
    await expect(this.toInput).not.toHaveValue("");
    await expect(this.toInput).not.toHaveValue("0");
    await expect(this.timerRefreshInterval).toBeEnabled();
    await expect(this.conversionButton).toBeEnabled();
    await expect(this.emptyConversionText).not.toBeVisible();
  }

  async clickAndValidateInvertOrder() {
    const initialFromCurrency = await this.getFromCurrency();
    const initialToCurrency = await this.getToCurrency();
    await this.invertOrderButton.click();
    const newFromCurrency = await this.getFromCurrency();
    const newToCurrency = await this.getToCurrency();
    // validate that the currencies have changed and are different from before, we can nt value the exact order as the api is not working, but we can replace this when the api is working
    expect(initialFromCurrency).not.toEqual(newFromCurrency);
    expect(initialToCurrency).not.toEqual(newToCurrency);
  }

  async performConversion() {
    await this.conversionButton.click();
    await expect(this.conversionHistoryTable).toBeVisible();
  }

  async validateConversionHistory() {
    await expect(this.conversionHistoryTable).toBeVisible();
    const rowCount = await this.conversionHistoryTable
      .locator("tbody tr")
      .count();
    expect(rowCount).toBeGreaterThan(0);
  }

  getFromCurrency() {
    return this.fromCurrencyInput.inputValue();
  }

  getToCurrency() {
    return this.toCurrencyInput.inputValue();
  }

  getConversionHistoryRowCount() {
    return this.conversionHistoryTable.locator("tbody tr").count();
  }

  isConversionHistoryTableVisible() {
    return this.conversionHistoryTable.isVisible();
  }

  clickToCurrencySelect() {
    return this.toCurrencySelect.click();
  }

  selectToCurrency(currency: string) {
    return this.toCurrencySelect.getByText(currency).click();
  }

  async isCurrencyDisabledInToInput(currency: string) {
    await expect(this.loadingSpinner).not.toBeVisible();

    await this.toCurrencySelectArrow.click();
    const option = this.optionsContainer.getByRole("option", {
      name: currency,
    });
    return option.isDisabled();
  }

  async isCurrencyDisabledInFromInput(currency: string) {
    await this.fromCurrencySelectArrow.click();
    const option = this.optionsContainer.getByRole("option", {
      name: currency,
    });
    return option.isDisabled();
  }

  async getExchangeRate(): Promise<number> {
    const rateText = await this.exchangeRateText.textContent();
    if (!rateText) return 0;

    const match = rateText.match(/\$\s*(\d+(\.\d+)?)\s+[A-Z]{3}/);

    if (match && match[1]) {
      return parseFloat(match[1]);
    }

    const fallbackMatch = rateText.match(/(\d+(\.\d{1,2})?)/);
    return fallbackMatch ? parseFloat(fallbackMatch[1]) : 0;
  }

  async getFromAmount(): Promise<number> {
    const value = await this.fromInput.inputValue();
    return parseFloat(value);
  }

  async getToAmount(): Promise<number> {
    const value = await this.toInput.inputValue();
    return parseFloat(value);
  }
}
