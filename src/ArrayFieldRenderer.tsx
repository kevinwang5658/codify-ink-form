import React from 'react';
import { FormFieldArray, SpecificFormFieldRendererProps } from './types.js';
import { Box } from 'ink';
import TextInput from 'ink-text-input';

export const ArrayFieldRenderer: React.FC<
  SpecificFormFieldRendererProps<FormFieldArray>
> = props => {
  const regex = props.field.regex;

  const change = (value: string) => {
    if (regex) {
      const arr = value.split(/(?<!\\),/);

      if (arr.some((i) => !regex.test(i))) {
        props.onError(`"${value}" does not pass the regex ${regex}`);
        props.onChange(value as any);
      }
    } else {
      props.onChange(value as any);
    }
  };

  return (
    <Box borderStyle={'round'} width="100%" flexDirection="column">
      <Box>
        <TextInput
          value={props.value?.toString() ?? ''}
          onChange={value => {
            props.onClearError();
            change(value);
          }}
          placeholder={props.field.placeholder ?? 'value1, value2, value3...'}
          onSubmit={() => props.onSetEditingField(undefined)}
        />
      </Box>
    </Box>
  );
};
