import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import Card from '../card';

export default {
  title: 'components/card',
  component: Card,
  subcomponents: {
    title: Card.Title,
    body: Card.Body,
    footer: Card.Footer,
  },
} as Meta;

export const Default = () => (
  <Card>
    <Card.Title>Title</Card.Title>
    <Card.Body>Body</Card.Body>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);
export const NoFooter = () => (
  <Card>
    <Card.Title>Title</Card.Title>
    <Card.Body>Body</Card.Body>
  </Card>
);
export const TitleOnly = () => (
  <Card>
    <Card.Title>Title</Card.Title>
  </Card>
);
export const NoTitle = () => (
  <Card>
    <Card.Body>Body</Card.Body>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);
export const FooterOnly = () => (
  <Card>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);
export const BodyOnly = () => (
  <Card>
    <Card.Body>Body</Card.Body>
  </Card>
);

export const CollapsableBody = () => (
  <Card>
    <Card.Title>Title</Card.Title>
    <Card.Body collapsable title="Some title">Body</Card.Body>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);

export const MultipleBodies = () => (
  <Card>
    <Card.Title>Title</Card.Title>
    <Card.Body>Body</Card.Body>
    <Card.Body>Body</Card.Body>
    <Card.Body>Body</Card.Body>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);

export const TitledBody = () => (
  <Card>
    <Card.Title>Title</Card.Title>
    <Card.Body title="Body Title">Body</Card.Body>
    <Card.Footer>Footer</Card.Footer>
  </Card>
);
