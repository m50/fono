import React, { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import tw from 'tailwind-styled-components';

interface Props {
  readonly title: string;
  className?: string;
  readonly register: UseFormRegisterReturn;
  readonly errors: FieldError | undefined;
}

interface Component {
  (props: Props): JSX.Element;
}

const Label = tw.span`
  text-lg pointer-events-none pl-2
`;

const Input = tw.input`
  form-checkbox rounded text-purple-600 p-2.5
  focus:outline-none focus:ring-0 focus:border-gray-400 focus:border-b-2
`;

const Errors = tw.small`
  text-red-400 h-8 pl-2
`;

const Checkbox: Component = ({ title, register, errors, className = '' }) => {
  return (
    <label htmlFor={register.name} className={className}>
      <div className="flex items-center justify-left">
        <Input type="checkbox" {...register} />
        <Label>{title}</Label>
      </div>
      <Errors>
        {errors && (errors?.message || (
          errors?.type === 'required'
            ? 'This field is required.'
            : 'An unknown error occured with this field.'
        ))}
      </Errors>
    </label>
  );
};

export default Checkbox;

