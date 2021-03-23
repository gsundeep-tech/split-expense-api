import React from 'react';
import ExpenseCalcCard from './ExpenseCalcCard';

function ProcessExpense(props) {
  const { users, products, header, handlePriceChange, handleCheckBox } = props;

  const renderUsersData = product => {
    return (
      <>
        {users.map(user => {
          return (
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div className="flex items-center h-5">
                  <input
                    id={user.user_name}
                    name={user.user_name}
                    type="checkbox"
                    onChange={() => handleCheckBox(product, user)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
              </div>
            </td>
          );
        })}
      </>
    );
  };

  return (
    <div data-testid="process-expense">
      {products.length > 0 && users.length > 0 && (
        <>
          <div className="px-4 pt-6 sm:px-0">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            style={{ width: '15%' }}
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Qty
                          </th>
                          {users.map(user => {
                            return (
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {user.user_name}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products &&
                          products.length > 0 &&
                          products.map(product => {
                            return (
                              <tr>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    <input
                                      type="text"
                                      name={product.product_name}
                                      id={product.product_name}
                                      value={product.price}
                                      style={{ width: '50%' }}
                                      onChange={e => handlePriceChange(e, product)}
                                      className="border border-black mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">{product.qty}</div>
                                  </div>
                                </td>
                                {renderUsersData(product)}
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
          <ExpenseCalcCard header={header} users={users} />
        </>
      )}
    </div>
  );
}

export default ProcessExpense;
