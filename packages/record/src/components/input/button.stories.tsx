import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import Button from './button';

export default {
  title: 'components/input/button',
  component: Button,
} as Meta;

interface Args {
    text: string;
    type?: 'button' | 'reset' | 'submit';
    className?: string;
    primary?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    onClick?: () => void;
}

const Template: Story<Args> = ({ text, ...args }) => (
  <Button {...args}>{text}</Button>
);

export const Default = Template.bind({});
Default.args = {
  primary: false,
  text: 'Close',
  type: 'button',
};

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  text: 'Submit',
  type: 'submit',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  text: 'Submit',
  primary: true,
  type: 'button',
};
