import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Card from './index';

describe('Card', () => {
  it('Can only have one title', () => {
    render((
      <Card>
        <Card.Title>Title</Card.Title>
        <Card.Title>Title</Card.Title>
      </Card>
    ));
    expect(screen.getAllByText('Title')).toHaveLength(1);
  });

  it('Can only have one footer', () => {
    render((
      <Card>
        <Card.Footer>Footer</Card.Footer>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    ));
    expect(screen.getAllByText('Footer')).toHaveLength(1);
  });

  it('Can only have multiple bodies', () => {
    render((
      <Card>
        <Card.Body>Body</Card.Body>
        <Card.Body>Body</Card.Body>
      </Card>
    ));
    expect(screen.getAllByText('Body')).toHaveLength(2);
  });

  it('matches snapshot', () => {
    const { asFragment } = render((
      <Card>
        <Card.Title>Title</Card.Title>
        <Card.Body title="Titled Section" collapsable>Body</Card.Body>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    ));
    expect(asFragment()).toMatchSnapshot();
  });

  it('can have a collapsable body', async () => {
    const { getByTestId } = render((
      <Card>
        <Card.Body title="Titled Section" collapsable>Body</Card.Body>
      </Card>
    ));
    const button = getByTestId('collapse');
    const content = getByTestId('body-content');

    expect(content.classList.contains('hidden')).not.toBeTruthy();

    await act(() => {
      button.click();
    });

    expect(content.classList.contains('hidden')).toBeTruthy();
  });
});
