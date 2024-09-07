import { FunctionComponent } from "react";
import { HStack, Input } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import {
  OPTIONS_OBJECT_FOR_CONVERTER,
  OPTIONS_FOR_CONVERTER,
} from "../utils/helpers.ts";

type Props = {
  amount: string;
  setAmount: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  disabledOption: string;
  isDisabled?: boolean;
};

const formatOptionLabel = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  const option = OPTIONS_OBJECT_FOR_CONVERTER[value];
  return (
    <HStack spacing={2}>
      <img src={option.icon} alt={option.alt} width="20" height="15" />
      <span>{label}</span>
    </HStack>
  );
};

export const CurrencyInput: FunctionComponent<Props> = ({
  amount,
  setAmount,
  currency,
  setCurrency,
  disabledOption,
  isDisabled,
}) => {
  return (
    <HStack
      spacing={0}
      w="100%"
      border={"1px solid #C6C6C6"}
      //style the react select component
      sx={{
        ".react-select": {
          minWidth: "30%",
        },
        ".react-select__single-value > div": {
          justifyContent: "center",
        },
        ".react-select__indicators > hr": {
          display: "none",
        },
        ".react-select__menu-list": {
          borderRadius: "none",
        },
        ".react-select__control": {
          backgroundColor: "white",
          borderRadius: "none",
          fontSize: "16px",
        },
        ".react-select__dropdown-indicator": {
          backgroundColor: "transparent",
          padding: "0",
        },
        ".react-select__value-container": {
          padding: "0",
        },
      }}
    >
      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        minW={"70%"}
        borderRadius="none"
        isDisabled={isDisabled}
      />
      <Select
        value={{
          value: currency,
          label: currency,
        }}
        formatOptionLabel={formatOptionLabel}
        onChange={(e) => {
          if (e) {
            setCurrency(e?.value);
          }
        }}
        options={OPTIONS_FOR_CONVERTER.map((option) => ({
          ...option,
          isDisabled: option.value === disabledOption,
        }))}
        isSearchable={false}
        className={"react-select"}
        classNamePrefix={"react-select"}
      />
    </HStack>
  );
};
