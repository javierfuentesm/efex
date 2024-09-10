import { ErrorScreen } from "../components/ErrorScreen.tsx";

import { useState } from "react";
import { RefreshTimer } from "../components/RefreshTimer.tsx";
import {
  Flex,
  Heading,
  useColorModeValue,
  VStack,
  Text,
  Button,
  HStack,
  Image,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import InvertOrder from "../assets/inverOrder.svg";
import { CurrencyInput } from "../components/CurrencyInput.tsx";
import { currency, OPTIONS_OBJECT_FOR_CONVERTER } from "../utils/helpers.ts";
import { useQuery } from "@tanstack/react-query";
import { ExchangeRateResponse, fetchExchangeRate } from "../utils/api.ts";

const TIMEOUT = 60;

type ConversionHistory = {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  timestamp: number;
};

type CalculateAmountParams = {
  amount: string;
  buyRate: number;
  sellRate: number;
  isMainCurrency: boolean;
};

const calculateDerivedAmount = ({
  amount,
  buyRate,
  sellRate,
  isMainCurrency,
}: CalculateAmountParams): string => {
  if (amount === "" || amount === "0" || !buyRate || !sellRate) return "";
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return "";

  const rate = isMainCurrency ? buyRate : 1 / buyRate;
  return (parsed * rate).toFixed(3);
};

export const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("MXN");
  const [inputCurrency, setInputCurrency] = useState<"from" | "to">("from");
  const [inputAmount, setInputAmount] = useState("0");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [conversionHistory, setConversionHistory] = useState<
    ConversionHistory[]
  >([]);
  const queryKey = ["exchangeRate", fromCurrency, toCurrency];
  const {
    data: exchangeRateData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ExchangeRateResponse, Error>({
    queryKey,
    queryFn: () => fetchExchangeRate(fromCurrency, toCurrency),
  });

  const isSelectedFromCurrencyMain =
    exchangeRateData?.currency === fromCurrency &&
    exchangeRateData?.is_main_currency;

  const fromAmount =
    inputCurrency === "from"
      ? inputAmount
      : calculateDerivedAmount({
          amount: inputAmount,
          buyRate: exchangeRateData?.buy ?? 0,
          sellRate: exchangeRateData?.sell ?? 0,
          isMainCurrency: !isSelectedFromCurrencyMain,
        });

  const toAmount =
    inputCurrency === "to"
      ? inputAmount
      : calculateDerivedAmount({
          amount: inputAmount,
          buyRate: exchangeRateData?.buy ?? 0,
          sellRate: exchangeRateData?.sell ?? 0,
          isMainCurrency: isSelectedFromCurrencyMain,
        });

  const handleConvert = () => {
    if (exchangeRateData) {
      const newConversion: ConversionHistory = {
        id: Date.now(),
        fromCurrency,
        toCurrency,
        fromAmount,
        toAmount,
        rate:
          inputCurrency === "from"
            ? exchangeRateData.buy
            : exchangeRateData.sell,
        timestamp: Date.now(),
      };
      setConversionHistory((prevHistory) => [...prevHistory, newConversion]);
    }
  };

  const invertOrder = () => {
    // Swap currencies
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    // Reset input values
    setInputAmount("0");
    setInputCurrency("from");
  };

  const handleFromAmountChange = (value: string) => {
    setInputAmount(value);
    setInputCurrency("from");
  };

  const handleToAmountChange = (value: string) => {
    setInputAmount(value);
    setInputCurrency("to");
  };

  if (isError) {
    return (
      <ErrorScreen
        message={
          error?.message || "An error occurred while fetching exchange rates."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <VStack
      maxWidth={{ base: "100%", md: "676px" }}
      minH={{ base: "auto", md: "672px" }}
      minW={{ base: "100%", md: "676px" }}
      margin="auto"
      padding={4}
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      backgroundColor={bgColor}
    >
      <VStack spacing={4} align="stretch" maxWidth="395px">
        <Heading
          size="md"
          textAlign="center"
          fontSize="18px"
          fontWeight={600}
          lineHeight="21.78px"
        >
          Convertir
        </Heading>
        <Text>Convierte la cantidad que quieras a una moneda diferente.</Text>
        <VStack spacing={"8px"} alignItems={"flex-start"}>
          <Text fontSize={"14px"} color={"#9E9E9E"} mb={2}>
            De {OPTIONS_OBJECT_FOR_CONVERTER[fromCurrency].text}
          </Text>
          <CurrencyInput
            name={"from"}
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            amount={fromAmount}
            setAmount={handleFromAmountChange}
            disabledOption={toCurrency}
            isDisabled={isLoading}
          />
          <Text fontSize="sm" color="#9E9E9E">
            Usted solo puede convertir {currency(fromAmount)}{" "}
            {OPTIONS_OBJECT_FOR_CONVERTER[fromCurrency].value}
          </Text>
        </VStack>

        <HStack alignSelf={"center"} onClick={invertOrder}>
          <Image src={InvertOrder} alt={"Invertir el orden"} />
          <Button variant={"link"} fontSize="14px" color={"#006BF8"}>
            Invertir orden
          </Button>
        </HStack>

        <VStack spacing={"8px"} alignItems={"flex-start"}>
          <Text fontSize={"14px"} color={"#9E9E9E"} mb={2}>
            A {OPTIONS_OBJECT_FOR_CONVERTER[toCurrency].text}
          </Text>
          <CurrencyInput
            name={"to"}
            currency={toCurrency}
            setCurrency={setToCurrency}
            amount={toAmount}
            setAmount={handleToAmountChange}
            disabledOption={fromCurrency}
            isDisabled={isLoading}
          />
          {isLoading && <Spinner size="sm" color="blue.500" />}
        </VStack>

        <Flex
          flexDirection={"column"}
          gap={4}
          fontSize={"14px"}
          w={"100%"}
          mt={"23px"}
        >
          <Flex justify="space-between">
            <Text>Tasa de cambio</Text>
            <Text data-testid="exchange-rate" fontWeight={700}>
              {exchangeRateData?.exchange_label}
            </Text>
          </Flex>

          {fromAmount !== "0" && toAmount !== "0" && (
            <Flex justify="space-between">
              <Text>Las tarifas se actualizarán en</Text>
              <RefreshTimer
                key={queryKey.join("-")}
                initialTime={TIMEOUT}
                onRefresh={refetch}
              />
            </Flex>
          )}
          <Flex justify="space-between">
            <Text>Total convertido</Text>
            {isLoading ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <>
                {currency(toAmount)}{" "}
                {OPTIONS_OBJECT_FOR_CONVERTER[toCurrency].value}
              </>
            )}
          </Flex>
        </Flex>
        <Button
          alignSelf={"center"}
          borderRadius={0}
          maxW={"192px"}
          h={"43px"}
          bg={"#006BF8"}
          onClick={handleConvert}
          color={"white"}
          mt={"40px"}
          isDisabled={isLoading || fromAmount === "0" || toAmount === "0"}
        >
          Realizar conversión
        </Button>
      </VStack>
      {conversionHistory.length > 0 && (
        <VStack mt={6} align="stretch" maxWidth="100%" overflow={"auto"}>
          <Heading size="md">Historial de Conversiones</Heading>
          <Table variant="simple" maxW={"100%"}>
            <Thead>
              <Tr>
                <Th>Fecha</Th>
                <Th>De</Th>
                <Th>A</Th>
                <Th>Monto Original</Th>
                <Th>Monto Convertido</Th>
                <Th>Tasa</Th>
              </Tr>
            </Thead>
            <Tbody>
              {conversionHistory.map((conversion) => (
                <Tr key={conversion.id}>
                  <Td>{new Date(conversion.timestamp).toLocaleString()}</Td>
                  <Td>{conversion.fromCurrency}</Td>
                  <Td>{conversion.toCurrency}</Td>
                  <Td>{conversion.fromAmount}</Td>
                  <Td>{conversion.toAmount}</Td>
                  <Td>{conversion.rate.toFixed(4)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      )}
    </VStack>
  );
};
