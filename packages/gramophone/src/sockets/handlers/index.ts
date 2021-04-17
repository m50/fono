import type { Handlers } from '../types';
import test from './test';
import broadcast from './broadcast';

const handlers: Handlers = { test, broadcast };

export default handlers;
