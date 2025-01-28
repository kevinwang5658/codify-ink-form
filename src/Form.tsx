import { Box, useFocusManager, useInput } from 'ink';
import { useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { FormProps } from './types.js';
import { FormHeader } from './FormHeader.js';
import { FormFieldRenderer } from './FormFieldRenderer.js';
import { DescriptionRenderer } from './DescriptionRenderer.js';
import { canSubmit } from './canSubmit.js';
import { SubmitButton } from './SubmitButton.js';
import { Button } from './Button.js';
import { ScrollArea } from './ScrollArea.js';
import { FullScreen } from './FullScreen.js';

export const Form: React.FC<FormProps> = props => {
  const isControlled = props.value !== undefined;
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sections, setSections] = useState(props.form.sections);
  const [value, setValue] = useState<Array<Record<string, unknown>>>(props.value ?? Array.from({ length: sections.length }, () => ({})));
  const [editingField, setEditingField] = useState<string>();
  const canSubmitForm = useMemo(() => canSubmit(props.form, value), [value, props.form]);
  const focusManager = useFocusManager();
  const [focusedElement, setFocusedElement] = useState(0);

  useEffect(() => {
    focusManager.enableFocus();
  }, []);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    // Set initial values
    if (!isControlled) {
      props.form.sections.forEach((section, index) => {
        setValueAndPropagate(index, section.fields
          .map(field => (field.initialValue !== undefined ? { [field.name]: field.initialValue } : {}))
          .reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {}));
      })
    }
  }, []);

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
    focusManager.focus('0');
    setFocusedElement(0)
  }

  const setValueAndPropagate = (index: number, newValue: Record<string, unknown>) => {
    value[index] = newValue
    setValue(structuredClone(value));
    props.onChange?.(value);
  };

  useInput(
    (input, key) => {
      if (key.upArrow) {
        if (focusedElement - 1 <= 0) {
          return;
        }

        setFocusedElement((focusedElement) => focusedElement - 1);
        focusManager.focusPrevious();
      } else if (key.downArrow) {
        if (focusedElement + 1 > sections[currentTab].fields.length + 2) {
          return;
        }

        setFocusedElement((focusedElement) => focusedElement + 1);
        focusManager.focusNext();
      }
    },
    { isActive: !editingField }
  );

  const duplicateCurrentItem = () => {
    const newTabs = [...sections]
    newTabs.splice(currentTab + 1, 0, sections[currentTab])

    const newValue = { ...value[currentTab]};
    value.splice(currentTab + 1, 0, newValue);

    setSections(newTabs);
    setValue([...value]);
  }

  const removeCurrentItem = () => {
    const newTabs = [...sections]
    newTabs.splice(currentTab, 1);
    value.splice(currentTab, 1)

    setSections(newTabs);
    setValue([...value]);
  }

  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    }

    process.stdout.on("resize", onResize);
    return () => {
      process.stdout.off("resize", onResize);
    };
  }, []);

  return (
    <FullScreen>
      <Box width="100%" height="90%" flexDirection="column" overflowY="hidden">
        <FormHeader {...props} form={{ ...props.form, sections }} currentTab={currentTab} onChangeTab={onChangeTab} editingField={editingField} />
        <ScrollArea height={size.rows - 6} key={currentTab} isStart={focusedElement === 0}>
          {!editingField && sections[currentTab].description && (
            <Box marginX={4}>
              <DescriptionRenderer description={props.form.sections[currentTab]?.description} />
            </Box>
          )}
          <Box flexDirection="column">
            {currentTab > props.form.sections.length - 1
              ? null
              : sections[currentTab].fields.map((field, index) => (
                <FormFieldRenderer
                  id={index + ''}
                  field={field}
                  key={field.name + currentTab}
                  form={props.form}
                  value={value[currentTab][field.name]}
                  onChange={v => setValueAndPropagate(currentTab, { ...value[currentTab], [field.name]: v })}
                  onSetEditingField={setEditingField}
                  editingField={editingField}
                  customManagers={props.customManagers}
                />
              ))}
            <Box flexDirection="row-reverse">
              <Button label="Add Item (duplicate)" onClicked={() => duplicateCurrentItem()}/>
            </Box>
            <Box flexDirection="row-reverse">
              <Button label="Remove" onClicked={() => removeCurrentItem()}/>
            </Box>
          </Box>
          {!editingField && (
            <Box flexDirection="row-reverse">
              <SubmitButton canSubmit={canSubmitForm} onSubmit={() => {
                props.onSubmit?.(value)
                setIsSubmitted(true);
              }}/>
            </Box>
          )}
        </ScrollArea>
      </Box>
    </FullScreen>

  );
};
