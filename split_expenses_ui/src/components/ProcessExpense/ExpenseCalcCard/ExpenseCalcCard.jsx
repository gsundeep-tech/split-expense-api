import React from 'react';

function ExpenseCalcCard(props) {
  const { header, users } = props;
  return (
    <div className="py-10 bg-gray-100 flex flex-col justify-center" data-testid="expense-calc-card">
      <div className="relative py-3 w-3/6 sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r bg-blue-700 hover:bg-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-0 sm:rounded-3xl"></div>
        <div className="relative px-4 py-3 bg-white shadow-lg sm:rounded-3xl sm:p-5 mx-1">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">Total</div>
                        </div>
                      </td>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{header.total}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">Discount</div>
                        </div>
                      </td>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{header.discount}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">Net Amount Paid</div>
                        </div>
                      </td>
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{header.net_amount}</div>
                      </td>
                    </tr>

                    {users.map(user => {
                      return (
                        <tr>
                          <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{user.user_name} total</div>
                            </div>
                          </td>
                          <td colSpan="2" className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.total} - {user.discount} = {user.net_amount}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseCalcCard;
