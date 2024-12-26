import React, { useEffect, useState } from "react";

export const Progress = ({ timer }) => {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 10);
    }, [10]);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={timer} />;
};
