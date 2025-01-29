import { render } from 'ink';
import { Form } from '../Form.js';
import React from 'react';

const options = [
  {label: 'Millenium Falcon', value: 'falcon'},
  {label: 'TIE Advanced X1', value: 'tieadv'},
  {label: 'X-Wing', value: 'xwing'},
  {label: 'Raizorcrest', value: 'mando'},
];

render(
  <Form
    onSubmit={value => console.log(`Submitted: `, value)}
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
);
