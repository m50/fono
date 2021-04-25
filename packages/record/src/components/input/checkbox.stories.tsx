import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import type { FieldError } from 'react-hook-form';
import Checkbox from './checkbox';

export default {
  title: 'components/input/checkbox',
  component: Checkbox,
} as Meta;

const register = {
  onChange: () => Promise.resolve(),
  onBlur: () => Promise.resolve(),
  ref: () => { },
  name: 'example',
};

export const Default = () => <Checkbox register={register} title="Checkbox" errors={undefined} />

