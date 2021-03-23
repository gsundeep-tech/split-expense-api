import React from 'react';
import { render } from '@testing-library/react';
import Users from './Users';

// TO-DO: Add complete tests
describe('<Users />', () => {
  it('should render Users page', () => {
    const { getByTestId } = render(<Users />);
    expect(getByTestId('users-page')).toBeTruthy();
  });
});
