import React from 'react';
import { render } from '@testing-library/react';
import ExpenseCalcCard from './ExpenseCalcCard';

// TO-DO: Add complete tests
describe('<ExpenseCalcCard />', () => {
  const props = {
    header: {
      total: 100,
      net_amount: 0,
      discount: 0,
      delivery_fee: 0,
    },
    users: [
      {
        user_name: 'Andy',
        total: 10,
        discount: 0,
        net_amount: 0,
      },
    ],
  };
  it('should render ExpenseCalcCard component', () => {
    const { getByTestId } = render(<ExpenseCalcCard {...props} />);
    expect(getByTestId('expense-calc-card')).toBeTruthy();
  });
});
