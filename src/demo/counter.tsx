import { Box, Text, render, useApp, useInput } from "ink";
import React, { useState } from 'react';

console.log('Previous message ')
console.log('Should still show up')

const Counter = () => {
  const [counter, setCounter] = React.useState(0);
  const { exit } = useApp();
  const [isExited, setIsExited] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prevCounter => prevCounter + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  });

  useInput((input, key) => {
    if (input === "q" || key.escape) {
      setIsExited(true);
      process.stdout.write(leaveAltScreenCommand);
    }
  });

  return !isExited ? <Text color={'green'}>{counter} tests passed</Text> : <Box flexDirection={'column'}>
    <Text color={'red'}>Exited</Text>
    <Text color={'red'}>The program</Text>
  </Box>
};

const enterAltScreenCommand = "\x1b[?1049h";
const leaveAltScreenCommand = "\x1b[?1049l";
process.stdout.write(enterAltScreenCommand);
process.on("exit", () => {
  process.stdout.write(leaveAltScreenCommand);
});

render(<Counter />);
