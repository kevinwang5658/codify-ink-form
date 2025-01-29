import { Box, Text, render } from 'ink';
import { Form } from '../Form.js';
import React from 'react';
import { Test } from './Test.js';

const options = [
  {label: 'Millenium Falcon', value: 'falcon'},
  {label: 'TIE Advanced X1', value: 'tieadv'},
  {label: 'X-Wing', value: 'xwing'},
  {label: 'Raizorcrest', value: 'mando'},
];

console.log('Test');
console.log('Test 1');
console.log('Test 2');
console.log('Test 3');

render(
  <Box>
    <Test/>
  </Box>
);
