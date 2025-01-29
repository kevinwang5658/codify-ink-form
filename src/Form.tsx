import { Box, Text, measureElement, useFocusManager, useInput } from 'ink';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { FormProps } from './types.js';
import { FormHeader } from './FormHeader.js';
import { FormFieldRenderer } from './FormFieldRenderer.js';
import { DescriptionRenderer } from './DescriptionRenderer.js';
import { canSubmit } from './canSubmit.js';
import { SubmitButton } from './SubmitButton.js';
import { Button } from './Button.js';
import { ScrollArea } from './ScrollArea.js';
import { FullScreen, useStdoutDimensions } from './FullScreen.js';

export const Form: React.FC<FormProps> = props => {
  const isControlled = props.value !== undefined;
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sections, setSections] = useState(props.form.sections);
  const form = { ...props.form, sections }
  const [value, setValue] = useState<Array<Record<string, unknown>>>(props.value ?? Array.from({ length: sections.length }, () => ({})));
  const [editingField, setEditingField] = useState<string>();
  const canSubmitForm = useMemo(() => canSubmit(form, value), [value, form]);
  const focusManager = useFocusManager();
  const [focusedElement, setFocusedElement] = useState(0);
  const headerRef = useRef();
  const headerHeight = headerRef.current ? measureElement(headerRef.current).height : 5
  const [, fullHeight] = useStdoutDimensions()

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

  const onSetEditingField = (field?: string) => {
    const isEditing = !!editingField;
    if (!isEditing && field) {
      const elementNum = sections[currentTab].fields.findIndex((f) => f.name === field);
      setFocusedElement(elementNum + 1);
    }

    setEditingField(field);
  }

  const onChangeTab = (tab: number) => {
    setCurrentTab(tab);
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
        // This calculates the maximum amount of children there is. We don't want to scroll past the last item
        // Fields.length is number of json fields. 2 is the add and remove buttons. Submit button is sometimes focusable
        if (focusedElement + 1 > sections[currentTab].fields.length + 2 + (canSubmitForm ? 1 : 0)) {
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
    onChangeTab(currentTab - 1)
  }

  return (
    <FullScreen>
      <Box width="100%" height="90%" flexDirection="column" overflowY="hidden">
        <FormHeader {...props} headerRef={headerRef} form={form} currentTab={currentTab} onChangeTab={onChangeTab} editingField={editingField} />
        <ScrollArea height={fullHeight - headerHeight} key={currentTab} isStart={focusedElement === 0} editingMode={!!editingField}>
          {!editingField && sections[currentTab].description && (
            <Box marginX={4}>
              <DescriptionRenderer description={sections[currentTab]?.description} />
            </Box>
          )}
          {!editingField && (
            <Box flexDirection='column'>
              <Box marginLeft={1} marginTop={1}>
                <Text bold>{sections[currentTab].title}</Text>
              </Box>
              <Text>{' {'}</Text>
            </Box>
          )}
          <Box flexDirection="column">
            {currentTab > sections.length - 1
              ? null
              : sections[currentTab].fields.map((field, index) => (
                <FormFieldRenderer
                  id={`${index}`}
                  field={field}
                  key={field.name + currentTab}
                  form={form}
                  value={value[currentTab][field.name]}
                  onChange={v => setValueAndPropagate(currentTab, { ...value[currentTab], [field.name]: v })}
                  onSetEditingField={onSetEditingField}
                  editingField={editingField}
                  customManagers={props.customManagers}
                />
              ))}
            {!editingField && (
              <Text>{' }'}</Text>
            )}
            <Box flexDirection="row-reverse">
              <Button label="Add (duplicate)" id={'addButton'} onClicked={() => duplicateCurrentItem()}/>
            </Box>
            <Box flexDirection="row-reverse">
              <Button label="Remove" id={'removeButton'} onClicked={() => removeCurrentItem()}/>
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
