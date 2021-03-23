import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

// TO-DO: Add complete tests
describe('<Spinner />', () => {
  it('should render Spinner component', () => {
    const { getByTestId } = render(<Spinner />);
    expect(getByTestId('spinner')).toBeTruthy();
  });
});
