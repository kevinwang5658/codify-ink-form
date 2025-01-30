import React from 'react';
import { Text, Box, useFocus, useInput } from 'ink';

export const SubmitButton: React.FC<{
  canSubmit: boolean;
  onSubmit: () => void;
}> = props => {
  const { isFocused } = useFocus({ isActive: props.canSubmit });
  useInput((input, key) => {
    if (key.return && isFocused && props.canSubmit) {
      props.onSubmit();
    }
  });

  return (
    <Box marginRight={2}>
      <Box borderStyle={'round'} borderColor={!props.canSubmit ? 'gray' : isFocused ? 'blue' : 'green'} paddingX={2}>
        <Text color={!props.canSubmit ? 'gray' : isFocused ? 'blue' : 'green'} bold={true} underline={isFocused}>
          {props.canSubmit ? 'Submit' : 'Cannot submit yet'}
        </Text>
      </Box>
    </Box>
  );
};
