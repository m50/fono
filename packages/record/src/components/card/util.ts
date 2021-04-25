import { Children } from './types';

export const extractChildren = (children?: Children) => {
  let title: JSX.Element | null = null;
  const body: JSX.Element[] = [];
  let footer: JSX.Element | null = null;
  if (Array.isArray(children)) {
    children
      .filter((child) => ['Title', 'Body', 'Footer'].includes(child.type.name))
      .forEach((child) => {
        if (child.type.name === 'Title') {
          title = child;
        } else if (child.type.name === 'Body') {
          body.push(child);
        } else if (child.type.name === 'Footer') {
          footer = child;
        }
      });
  } else if (children?.type.name === 'Title') {
    title = children
  } else if (children?.type.name === 'Body') {
    body.push(children);
  } else if (children?.type.name === 'Footer') {
    footer = children
  }
  return [title, body, footer];
}
