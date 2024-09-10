import { expect, test } from "@playwright/test";
import { ConverterPage } from "./pages/Converter";

test.describe("test all the functionally in the Currency converter", () => {
  let converterPage: ConverterPage;

  test.beforeEach(async ({ page }) => {
    converterPage = new ConverterPage(page);
    await converterPage.goto();
  });

  test("test navigate and verify everything is render properly", async () => {
    await converterPage.validatePage();
  });

  test("test the conversion of the currency", async () => {
    await converterPage.fillFromInput("100");
    await converterPage.validateConversionOccurred();
  });

  test("invert order of currencies", async () => {
    await converterPage.fillFromInput("100");
    await converterPage.clickAndValidateInvertOrder();
  });

  test("perform conversion and display history table", async () => {
    await converterPage.fillFromInput("100");
    await converterPage.validateConversionOccurred();

    // Check that the history table is not visible initially
    expect(await converterPage.isConversionHistoryTableVisible()).toBe(false);

    // Perform the conversion
    await converterPage.performConversion();

    // Check that the history table is now visible
    expect(await converterPage.isConversionHistoryTableVisible()).toBe(true);

    // Check that there is one row in the history table
    expect(await converterPage.getConversionHistoryRowCount()).toBe(1);

    // Perform another conversion
    await converterPage.fillFromInput("200");
    await converterPage.performConversion();

    // Check that there are now two rows in the history table
    expect(await converterPage.getConversionHistoryRowCount()).toBe(2);
  });

  test("selecting a currency disables it in the other input", async () => {
    // Verify that USD is selected in the 'from' input by default
    await expect(
      converterPage.fromCurrencySelect.getByText("USD"),
    ).toBeVisible();

    // Verify that USD is disabled in the 'to' currency input
    expect(await converterPage.isCurrencyDisabledInToInput("USD")).toBe(true);

    // Now, select a different currency in the 'to' input
    await converterPage.selectToCurrency("EUR");

    // Verify that EUR is selected in the 'to' input
    await expect(converterPage.toCurrencySelect.getByText("EUR")).toBeVisible();
    // Verify that EUR is now disabled in the 'from' currency input
    expect(await converterPage.isCurrencyDisabledInFromInput("EUR")).toBe(true);
  });

  test("verify exchange rate calculation", async () => {
    // Input a value in the 'from' field
    await converterPage.fillFromInput("1");
    await converterPage.validateConversionOccurred();

    // Get the exchange rate, 'from' amount, and 'to' amount
    const exchangeRate = await converterPage.getExchangeRate();
    const fromAmount = await converterPage.getFromAmount();
    const toAmount = await converterPage.getToAmount();

    // Calculate the expected 'to' amount based on the exchange rate
    const expectedToAmount = fromAmount * exchangeRate;

    // Verify that the calculated amount matches the displayed amount (allowing for small rounding differences)
    expect(Math.abs(toAmount - expectedToAmount)).toBeLessThan(0.01);

    // Now test the reverse conversion
    await converterPage.clickAndValidateInvertOrder();
    await converterPage.fillFromInput("100");
    await converterPage.validateConversionOccurred();

    const newExchangeRate = await converterPage.getExchangeRate();
    const newFromAmount = await converterPage.getFromAmount();
    const newToAmount = await converterPage.getToAmount();

    const newExpectedToAmount = newFromAmount / newExchangeRate;

    expect(Math.abs(newToAmount - newExpectedToAmount)).toBeLessThan(0.01);
  });
});
