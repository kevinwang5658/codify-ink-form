import { Box, Text, useFocus, useInput } from 'ink';
import React from 'react';

export function Button(props: {
  label: string;
  onClicked?: () => void;
  id?: string;
  isEnabled?: boolean;
}) {
  const isEnabled = props.isEnabled ?? true;
  const { isFocused } = useFocus({ ...(props.id ? { id: props.id } : {}), isActive: props.isEnabled });

  useInput((input, key) => {
    if (!isEnabled) {
      return;
    }

    if (key.return && isFocused) {
      props.onClicked?.();
    }
  });

  return <Box marginX={2} paddingX={1} borderStyle="round" borderColor={!isEnabled ? 'gray' : isFocused ? 'blue' : 'magenta'}>
    <Box flexGrow={1}>
      <Text underline={isFocused} color={isFocused ? 'blue' : undefined}>
        {props.label}
      </Text>
    </Box>
  </Box>
}
