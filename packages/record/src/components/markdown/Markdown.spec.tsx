import React from 'react';
import renderer from 'react-test-renderer';
import { Markdown } from './Markdown';

const markdown = `
# Test

~~~js
const k = 1;
~~~

- 1
- 2
- 3
- [ ] test

[test](https://github.com/)
`;

describe('Markdown', () => {
  it('matches snapshot', () => {
    const tree = renderer
      .create(<Markdown>{markdown}</Markdown>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
