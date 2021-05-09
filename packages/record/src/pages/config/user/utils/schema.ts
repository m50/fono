import * as yup from 'yup';

export const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().optional()
    .test('min', 'password must be at least 8 characters', (p) => !p || p.length >= 8)
    .matches(/^((?!(.)\2{1,}).)*$/, {
      excludeEmptyString: true,
      message: 'password must not have repeating characters.',
    })
    .matches(/[A-Z]/, {
      excludeEmptyString: true,
      message: 'password must contain an upper-case letter.',
    })
    .matches(/[0-9]/, {
      excludeEmptyString: true,
      message: 'password must contain a number.',
    })
    .matches(/[!$#%@^\\/)(.[\]<>;:]/, {
      excludeEmptyString: true,
      message: 'password must contain a symbol ( ! $ # % @ ^ \\ / ( ) . [ ] < > ; : ).',
    })
    .matches(/[a-z]/, {
      excludeEmptyString: true,
      message: 'password must contain a lower-case letter.' }),
  passwordConfirmation: yup.string().optional()
    .when('password', (pword: string, sch: yup.StringSchema) => (pword.length > 0 ? sch.required() : sch))
    .when('password', (pword: string, sch: yup.StringSchema) => (pword.length > 0
      ? sch.equals([pword], 'Passwords must match!')
      : sch)),
  currentPassword: yup.string()
    .when('password', (pword: string, sch: yup.StringSchema) => (pword.length > 0 ? sch.required() : sch))
    .when('password', (pword: string, sch: yup.StringSchema) => (pword.length > 0 ? sch.notOneOf(
      [pword],
      'New password and current password cannot match. Did you mistype your current password?',
    ) : sch)),
});
