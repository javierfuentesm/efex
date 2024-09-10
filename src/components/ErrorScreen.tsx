import React from 'react';
import { VStack, Text, Button } from '@chakra-ui/react';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100%">
      <Text fontSize="xl" fontWeight="bold" color="red.500">
        Error
      </Text>
      <Text>{message}</Text>
      <Button onClick={onRetry} colorScheme="blue">
        Retry
      </Button>
    </VStack>
  );
};
