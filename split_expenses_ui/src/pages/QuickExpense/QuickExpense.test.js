import React from 'react';
import { render } from '@testing-library/react';
import QuickExpense from './QuickExpense';

// TO-DO: Add complete tests
describe('<QuickExpense />', () => {
  it('should render QuickExpense page', () => {
    const { getByTestId } = render(<QuickExpense />);
    expect(getByTestId('quick-expense-page')).toBeTruthy();
  });
});
