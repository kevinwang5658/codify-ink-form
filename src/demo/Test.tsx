import { Box, Text, useInput, useStdout } from "ink";
import React, { useEffect, useLayoutEffect } from 'react';
import { Form } from '../Form.js';

export function Test() {
  const stdout = useStdout();

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);

  useLayoutEffect(() => {
    stdout.write('This is ap revious message\n')
    stdout.write('To show that previous messages will still exist...')
    stdout.write('The prompt will open shortly')

    setTimeout(() => {
      process.stdout.write('\x1b[?1049h');
      process.stdout.write('\x1b[?1000h');
      setShowPrompt(true)
    }, 1000);

    process.on('beforeExit', () => {
      process.stdout.write('\x1b[?1049l');
      process.stdout.write('\x1b[?1000l');
    });
  }, []);

  return (<Box flexDirection='column'>
    {!isSubmitted && showPrompt && (
      <Form
        onSubmit={value => {
          process.stdout.write('\x1b[?1049l');
          process.stdout.write('\x1b[?1000l');
          setIsSubmitted(true)

          setTimeout(() => {
            stdout.write('Hihi\n');
          }, 1000)
        }}
        form={{
          title: "codify import",
          description: 'some parameters are required to continue import',
          sections: [
            {
              title: "asdf-global",
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'version', label: 'version', required: true },
              ],
              description: 'Asdf global sets the global version of a asdf installed plugin.'
            },
            {
              title: "asdf-install",
              description: 'Asdf install is responsible for installing an asdf resource',
              fields: [
                { type: 'string', name: 'directory', label: 'directory', required: true, description: 'The directory to install.' },
              ]
            },
            {
              title: "asdf-local",
              description: 'Asdf global sets the local version of a asdf installed plugin.',
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'version', label: 'version', required: true },
                { type: 'string', name: 'directory', label: 'directory' },
                { type: 'array', name: 'directories', label: 'directories' },
              ]
            },
            {
              title: "asdf-plugin",
              // description: 'Asdf plugin installs a plugin.',
              fields: [
                { type: 'string', name: 'plugin', label: 'plugin', required: true },
                { type: 'string', name: 'versions', label: 'version'},
                { type: 'string', name: 'gitUrl', label: 'gitUrl' },
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
