import React, { Component } from "react";
import { getusers } from "../services/users";
import { getProductsFromInvoice } from "../services/products";

class QuickExpense extends Component {
  state = {
    users: [],
    products: [],
    file: null,
    header: {},
  };

  fetchUsers = async () => {
    const users = await getusers();
    for (let i = 0; i < users.length; i++) {
      users[i]["total"] = 0;
      users[i]["netAmount"] = 0;
      users[i]["discount"] = 0;
    }
    this.setState({ users });
  };

  handleFormSubmit = async () => {
    const { header, line_item } = await getProductsFromInvoice(this.state.file);

    let updatedState = this.state;
    for (let i = 0; i < line_item.length; i++) {
      let data = {};
      data["productName"] = line_item[i]["Description"];
      data["price"] = line_item[i]["price"];
      data["id"] = i + 1;
      data["selectedUsers"] = [];
      updatedState.products.push(data);
    }
    console.log(updatedState);

    updatedState.header = {
      total: header.total,
      netAmount: header.nett_amount_paid,
      discount: Math.abs(header.lazada_discount),
      deliveryFee: header.delivery_fee,
    };

    this.setState({ updatedState });
  };

  handleFileChange = (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    this.setState({ file });
  };

  componentDidMount = () => {
    this.fetchUsers();
  };

  handleCheckBox = (product, user) => {
    let updatedState = this.state;

    const productIndex = updatedState.products.findIndex(
      (p) => p.id == product.id
    );
    if (productIndex === undefined) {
      return;
    }

    // checking if the user already exists,
    // whether to add the user or remove the user based on checkbox change
    const alreadySharedUsers =
      updatedState.products[productIndex].selectedUsers;
    let addingUser = true;
    for (let j = 0; j < alreadySharedUsers.length; j++) {
      if (alreadySharedUsers[j].id == user.id) {
        addingUser = false;
        break;
      }
    }

    // finding the user index, so that we can update the total
    const userIndex = updatedState.users.findIndex((u) => u.id == user.id);
    const previousUsersCount = alreadySharedUsers.length;
    if (previousUsersCount == 0) {
      updatedState.products[productIndex].selectedUsers.push(user);
      updatedState.users[userIndex].total = parseFloat(
        (updatedState.users[userIndex].total + product.price).toFixed(2)
      );
      updatedState.users[userIndex].discount = parseFloat(
        (
          (Math.abs(updatedState.header.discount) *
            updatedState.users[userIndex].total) /
          updatedState.header.total
        ).toFixed(2)
      );
      updatedState.users[userIndex].netAmount = parseFloat(
        (
          updatedState.users[userIndex].total -
          updatedState.users[userIndex].discount
        ).toFixed(2)
      );
    } else {
      const previousSharePrice = parseFloat(
        (
          updatedState.products[productIndex].price / previousUsersCount
        ).toFixed(2)
      );

      // remove the previous share price
      for (
        let i = 0;
        i < updatedState.products[productIndex].selectedUsers.length;
        i++
      ) {
        const tmpUser = updatedState.products[productIndex].selectedUsers[i];
        const tmpUserIndex = updatedState.users.findIndex(
          (u) => u.id == tmpUser.id
        );
        if (tmpUserIndex !== undefined) {
          updatedState.users[tmpUserIndex].total = parseFloat(
            (
              updatedState.users[tmpUserIndex].total - previousSharePrice
            ).toFixed(2)
          );
        }
      }

      // adding the current user to the shared users and calculating the share price
      if (addingUser) {
        updatedState.products[productIndex].selectedUsers.push(user);
      } else {
        // find the user and delete from the users list
        updatedState.products[
          productIndex
        ].selectedUsers = updatedState.products[
          productIndex
        ].selectedUsers.filter((u) => {
          return u.id != user.id;
        });
      }

      const currentUserCount =
        updatedState.products[productIndex].selectedUsers.length;

      const currentUserShare = parseFloat(
        (updatedState.products[productIndex].price / currentUserCount).toFixed(
          2
        )
      );

      for (
        let i = 0;
        i < updatedState.products[productIndex].selectedUsers.length;
        i++
      ) {
        const tmpUser = updatedState.products[productIndex].selectedUsers[i];
        const tmpUserIndex = updatedState.users.findIndex(
          (u) => u.id == tmpUser.id
        );
        if (tmpUserIndex !== undefined) {
          updatedState.users[tmpUserIndex].total = parseFloat(
            (updatedState.users[tmpUserIndex].total + currentUserShare).toFixed(
              2
            )
          );
          updatedState.users[tmpUserIndex].discount = parseFloat(
            (
              (Math.abs(updatedState.header.discount) *
                updatedState.users[tmpUserIndex].total) /
              updatedState.header.total
            ).toFixed(2)
          );
          updatedState.users[tmpUserIndex].netAmount = parseFloat(
            (
              updatedState.users[tmpUserIndex].total -
              updatedState.users[tmpUserIndex].discount
            ).toFixed(2)
          );
        }
      }
    }

    this.setState({ updatedState });
  };

  handlePriceChange = (e, product) => {
    const newPrice = e.target.value;

    // reduce the old price in all users
    console.log(newPrice);
    console.log(product);
  };

  render() {
    const { users, products, header } = this.state;
    return (
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <form>
            <label>
              Lazada Invoice:
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={this.handleFileChange}
              />
            </label>
            <input
              type="button"
              value="Submit"
              onClick={this.handleFormSubmit}
            />
          </form>
          <div className="px-4 py-6 sm:px-0">
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
                          >
                            Price
                          </th>
                          {users.map((user) => {
                            return (
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {user.username}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products &&
                          products.length > 0 &&
                          products.map((product) => {
                            // console.log(user);
                            return (
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.productName}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    <input
                                      type="text"
                                      name="city"
                                      id="city"
                                      value={product.price}
                                      onChange={(e) =>
                                        this.handlePriceChange(e, product)
                                      }
                                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                  </div>
                                </td>
                                {users.map((user) => {
                                  return (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        <div className="flex items-center h-5">
                                          <input
                                            id="comments"
                                            name="comments"
                                            type="checkbox"
                                            onChange={() =>
                                              this.handleCheckBox(product, user)
                                            }
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        {users && products && products.length > 0 && (
                          <>
                            <tr>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    total
                                  </div>
                                </div>
                              </td>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="text-sm text-gray-900">
                                  {header.total}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    Discount
                                  </div>
                                </div>
                              </td>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="text-sm text-gray-900">
                                  {header.discount}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    Net Amount Paid
                                  </div>
                                </div>
                              </td>
                              <td
                                colSpan="2"
                                className="px-6 py-4 whitespace-nowrap"
                              >
                                <div className="text-sm text-gray-900">
                                  {header.netAmount}
                                </div>
                              </td>
                            </tr>
                          </>
                        )}
                        {users &&
                          products &&
                          products.length > 0 &&
                          users.length > 0 &&
                          users.map((user) => {
                            return (
                              <tr>
                                <td
                                  colSpan="2"
                                  className="px-6 py-4 whitespace-nowrap"
                                >
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.username} total
                                    </div>
                                  </div>
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-6 py-4 whitespace-nowrap"
                                >
                                  <div className="text-sm text-gray-900">
                                    {user.total} - {user.discount} ={" "}
                                    {user.netAmount}
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
      </main>
    );
  }
}

export default QuickExpense;
