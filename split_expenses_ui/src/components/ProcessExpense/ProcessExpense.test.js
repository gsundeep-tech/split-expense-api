import React from 'react';
import { render } from '@testing-library/react';
import ProcessExpense from './ProcessExpense';

// TO-DO: Add complete tests
describe('<ProcessExpense />', () => {
  const props = {
    users: [
      {
        discount: 0,
        net_amount: 0,
        total: 10,
        user_name: 'Andy',
      },
    ],
    products: [
      {
        id: 1,
        price: 100,
        product_name: 'Apple',
        qty: '1',
      },
    ],
    header: {
      total: 100,
      net_amount: 0,
      discount: 0,
      delivery_fee: 0,
    },
    handlePriceChange: jest.fn(),
    handleCheckBox: jest.fn(),
  };

  it('should render ProcessExpense component', () => {
    const { getByTestId } = render(<ProcessExpense {...props} />);
    expect(getByTestId('process-expense')).toBeTruthy();
  });
});
