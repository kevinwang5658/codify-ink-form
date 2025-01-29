import { Box, Text, useInput, useStdout } from "ink";
import React, { useEffect, useLayoutEffect } from 'react';
import { Form } from '../Form.js';
import { clearInterval } from 'node:timers';
import { FullScreen } from '../FullScreen.js';

let counter = 0;

export function Test() {
  const stdout = useStdout();

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);

  useLayoutEffect(() => {
    stdout.write('This is ap revious message\n')

    setTimeout(() => {
      process.stdout.write('\x1b[?1049h');
      process.stdout.write('\x1b[?1000h');
      setShowPrompt(true)
    }, 3000);

  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (isSubmitted) {
        stdout.write('hi\n')
        counter++;
      }

      if (counter >= 1) {
        clearInterval(id)
      }
    }, 1000)
  }, [isSubmitted]);

  return (<Box flexDirection='column'>
    {!isSubmitted && showPrompt && (
      <Form
        onSubmit={value => {
          process.stdout.write('\x1b[?1049l');
          process.stdout.write('\x1b[?1000l');
          setIsSubmitted(true)
        }}
        form={{
          title: "Form title",
          sections: [
            {
              title: "asdf-global",
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'version', label: 'version', required: true },
              ]
            },
            {
              title: "asdf-install",
              fields: [
                { type: 'string', name: 'directory', label: 'directory', required: true },
              ]
            },
            {
              title: "asdf-local",
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'version', label: 'version', required: true },
                { type: 'string', name: 'directory', label: 'directory' },
                { type: 'string', name: 'directories', label: 'directories' },
              ]
            },
            {
              title: "asdf-plugin",
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'versions', label: 'version'},
                { type: 'string', name: 'gitUrl', label: 'plugin' },
              ]
            },
          ]
        }}
      />
    )}
    {
      isSubmitted && (
        <Text color={'green'}>Submitted!!</Text>
      )
    }
  </Box>)

}
