import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

interface RefreshTimerProps {
  initialTime: number;
  onRefresh: () => void;
}

export const RefreshTimer: React.FC<RefreshTimerProps> = ({
  initialTime,
  onRefresh,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          onRefresh();
          return initialTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onRefresh]);

  return <Text fontWeight={700}>{timeLeft} seconds</Text>;
};
