import React, { Component } from 'react';
import { Dialog } from '../../components/shared/Dialog';
import { Spinner } from '../../components/Spinner';
import { getProducts, postProducts } from '../../services';

class Products extends Component {
  state = {
    products: [],
    isDisplayDialog: false,
    isLoading: true,
    values: {
      product_name: '',
      product_price: '',
      product_qty: '',
    },
  };

  fetchProducts = async () => {
    const products = await getProducts();
    this.setState({ products, isLoading: false });
  };

  componentDidMount = () => {
    this.fetchProducts();
  };

  handleAddProduct = () => {
    const { isDisplayDialog } = this.state;
    this.setState({ isDisplayDialog: !isDisplayDialog });
  };

  handleSubmit = async () => {
    const { values } = this.state;
    await postProducts(values);
    await this.fetchProducts();
    this.handleAddProduct();
  };

  handleChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    const { values } = this.state;
    if (id === 'product_name') {
      values.product_name = value;
    } else if (id === 'product_price') {
      values.product_price = value;
    } else if (id === 'product_qty') {
      values.product_qty = value;
    }
    this.setState({ values });
  };

  render() {
    const { products, isDisplayDialog, isLoading, values } = this.state;
    return (
      <main data-testid="products-page">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <button
            onClick={this.handleAddProduct}
            className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
          >
            <svg
              className="group-hover:text-light-blue-600 text-light-blue-500 mr-2"
              width="12"
              height="20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"
              />
            </svg>
            Add
          </button>
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
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total Price (Previous Total Price)
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {!isLoading ? (
                          products &&
                          products.length > 0 &&
                          products.map(product => {
                            return (
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{product.quantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{product.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Edit
                                  </a>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <Spinner />
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isDisplayDialog && (
          <Dialog
            title="Add a product"
            isDialogOpen={isDisplayDialog}
            handleCloseDialog={this.handleAddProduct}
            handleSubmit={this.handleSubmit}
          >
            <div className="bg-white rounded px-8 pt-6 pb-8 flex flex-col">
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="product_name"
                  >
                    Product name
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                    id="product_name"
                    type="text"
                    placeholder="eg: Apple"
                    value={values.product_name}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="product_price"
                  >
                    product price
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    id="product_price"
                    type="text"
                    placeholder="eg: 99"
                    value={values.product_price}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="product_qty"
                  >
                    product quantity
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                    id="product_qty"
                    type="text"
                    placeholder="eg: 2"
                    value={values.product_qty}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </main>
    );
  }
}

export default Products;
