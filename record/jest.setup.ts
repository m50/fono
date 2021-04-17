/* eslint-disable */
import '@testing-library/jest-dom/extend-expect';
import fetch from 'node-fetch';

// @ts-ignore
window.fetch = (url: string, ...rest) => fetch(
  /^https?:/.test(url) ? url : new URL(url, 'http://localhost'),
  // @ts-ignore
	...rest
);
