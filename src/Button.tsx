import { Box, Text, useFocus, useInput } from 'ink';
import React from 'react';

export function Button(props: {
  label: string;
  onClicked?: () => void;
  id?: string;
}) {
  const { isFocused } = useFocus(props.id ? { id: props.id } : {});
  useInput((input, key) => {
    if (key.return && isFocused) {
      props.onClicked?.();
    }
  });

  return <Box marginX={2} paddingX={1} borderStyle="round" borderColor={isFocused ? 'blue' : 'magenta'}>
    <Box flexGrow={1}>
      <Text underline={isFocused} color={isFocused ? 'blue' : undefined}>
        {props.label}
      </Text>
    </Box>
  </Box>
}
