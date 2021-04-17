import React, { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import tw from 'tailwind-styled-components';

interface Props {
  readonly title: string;
  readonly type?: 'email' | 'password' | 'text' | 'url' | 'tel';
  readonly value?: string;
  readonly example?: string;
  readonly register: UseFormRegisterReturn;
  readonly errors: FieldError | undefined;
}

interface Component {
  (props: Props): JSX.Element;
}

const Label = tw.div`
  text-lg pointer-events-none pl-2 py-2
  transform transition-transform duration-150 ease-out
`;

const Input = tw.input`
  form-input pl-2 w-full placeholder-gray-500 placeholder-opacity-10
  bg-transparent border-gray-400 border-b
  focus:outline-none
  autofill:shadow-fill-gray-300 autofill:text-black
`;

const Errors = tw.small`
  text-red-400 h-8 pl-2
`;

const TextInput: Component = ({ title, type, value, register, errors, example }) => {
  const [moveTextUp, setMoveTextUp] = useState(false);
  return (
    <label htmlFor={register.name}>
      <Label className={moveTextUp ? 'translate-y-0' : 'translate-y-7'}>{title}</Label>
      <div>
        <Input type={type} {...register}
          defaultValue={value ?? ''}
          placeholder={moveTextUp ? example : ''}
          onFocus={() => setMoveTextUp(true)}
          onChange={(e: any) => {
            setMoveTextUp(!!e.target.value);
            register.onChange(e);
          }}
          onBlur={(e: any) => {
            if (!e.target.value) {
              setMoveTextUp(false);
            }
            register.onBlur(e);
          }}
        />
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

export default TextInput;
