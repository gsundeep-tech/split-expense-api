import React from 'react';
import { render } from '@testing-library/react';
import Dialog from './Dialog';

// TO-DO: Add complete tests
describe('<Dialog />', () => {
  it('should render Dialog component', () => {
    const { getByTestId } = render(<Dialog />);
    expect(getByTestId('dialog-container')).toBeTruthy();
  });
});
