import React from 'react';
import { render } from '@testing-library/react';
import Products from './Products';

// TO-DO: Add complete tests
describe('<Products />', () => {
  it('should render Products page', () => {
    const { getByTestId } = render(<Products />);
    expect(getByTestId('products-page')).toBeTruthy();
  });
});
