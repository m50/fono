import { schema } from './schema';

describe('user', () => {
  describe('schema', () => {
    it('email must be an email', async () => {
      try {
        await schema.validate({
          email: 'test',
          username: 'test',
          password: '',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('email');
        expect(e.errors[0]).toBe('email must be a valid email');
      }
    });
    it('password can be empty', async () => {
      const result = await schema.validate({
        email: 'test@test.com',
        username: 'test',
        password: '',
      });
      expect(result.password).toBe('');
    });
    it('password must be at least 8 characters long', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'a1!A',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must be at least 8 characters');
      }
    });
    it('password cannot have multiple of the same character in a row', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'aa1!aB14De',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must not have repeating characters.');
      }
    });
    it('password must have one upper case character', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'abcde123!',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must contain an upper-case letter.');
      }
    });
    it('password must have one lower case character', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'ABCDE123!',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must contain a lower-case letter.');
      }
    });
    it('password must have one number', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'a!bCdEfGhIj',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must contain a number.');
      }
    });
    it('password must have one symbol', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'a1bCdEfGhIj',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('password');
        expect(e.errors[0]).toBe('password must contain a symbol ( ! $ # % @ ^ \\ / ( ) . [ ] < > ; : ).');
      }
    });
    it('password confirmation must match password', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'a1bCdEfGhIj',
          passwordConfirmation: 'sadasdasd',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('passwordConfirmation');
        expect(e.errors[0]).toBe('Passwords must match!');
      }
    });
    it('current password cannot match a password', async () => {
      try {
        await schema.validate({
          email: 'test@test.com',
          username: 'test',
          password: 'a1bCdEfGhIj',
          passwordConfirmation: 'a1bCdEfGhIj',
          currentPassword: 'a1bCdEfGhIj',
        });
        expect(true).toBe(false); // If it doesn't throw force it to fail
      } catch (e) {
        expect(e.path).toBe('currentPassword');
        expect(e.errors[0])
          .toBe('New password and current password cannot match. Did you mistype your current password?');
      }
    });
  });
});
