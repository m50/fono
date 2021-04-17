import React, { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import tw from 'tailwind-styled-components';

interface Props {
  title: string;
  type?: 'email' | 'password' | 'text' | 'url' | 'tel';
  value?: string;
  example?: string;
  readonly register: UseFormRegisterReturn;
  readonly errors: FieldError | undefined;
}

interface Component {
  (props: Props): JSX.Element;
}

const Label = tw.div`
  text-lg pointer-events-none
  transform transition-transform duration-150 ease-out
`;

const Input = tw.input`
  form-input pl-2 w-full
  bg-transparent border-gray-400 border-b
  focus:outline-none
  autofill:shadow-fill-gray-300 autofill:text-black
`;

const Errors = tw.small`
  text-red-400
`;

const TextInput: Component = ({ title, type, value, register, errors, example }) => {
  const [moveTextUp, setMoveTextUp] = useState(false);
  return (
    <label htmlFor={register.name}>
      <Label className={moveTextUp ? 'translate-y-0' : 'translate-y-6'}>{title}</Label>
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
      {(errors?.message || errors?.type) && (
        <Errors>
          {errors.message || (
            errors.type === 'required'
              ? 'This field is required.'
              : 'An unknown error occured with this field.'
          )}
        </Errors>
      )}
    </label>
  );
};

export default TextInput;
