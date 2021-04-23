import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import Text from './text';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export default {
    title: 'components/input/text',
    component: Text,
} as Meta;

interface Args {
    title: string;
    type?: 'email' | 'password' | 'text' | 'url' | 'tel';
    value?: string;
    example?: string;
    errors: FieldError | undefined;
}

const register = {
    onChange: () => null,
    onBlur: () => null,
    ref: null,
    name: 'example',
};
const Template: Story<Args> = (args) => (
    <Text {...args} register={register}/>
);

export const Default = Template.bind({});
Default.args = {
    title: 'Default',
    type: 'text',
    example: 'Some test',
};

export const WithError = Template.bind({});
WithError.args = {
    title: 'With Error',
    type: 'text',
    example: 'Some test',
    errors: {
        type: 'Required',
        message: 'Required.',
    },
};

export const Password = Template.bind({});
Password.args = {
    title: 'Password',
    type: 'password',
    example: 'Some test',
};

export const Email = Template.bind({});
Email.args = {
    title: 'Email',
    type: 'email',
    example: 'example@test.com',
};

