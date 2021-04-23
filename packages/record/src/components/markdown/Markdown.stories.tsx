import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
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

export default {
    title: 'components/markdown',
    component: Markdown,
} as Meta;

interface Args {
  markdown: string;
  allowDangerousHtml?: boolean;
  className?: string;
}

const Template: Story<Args> = ({ markdown, ...args}) => (
    <Markdown {...args}>{markdown}</Markdown>
);

export const Example = Template.bind({});
Example.args = {
    markdown
};
