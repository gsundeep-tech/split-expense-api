import React, { Component } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { ProcessExpense } from '../../components/ProcessExpense';
import { Spinner } from '../../components/Spinner';
import { getProductsFromInvoice, getUsers } from '../../services';

const fileTypeOptions = [
  { value: 'pdf', label: 'Pdf' },
  { value: 'img', label: 'Image' },
];

const vendorNameOptions = [{ value: 'redmart', label: 'redmart' }];

class QuickExpense extends Component {
  state = {
    users: [],
    products: [],
    file: null,
    header: {},
    isLoading: false,
    isSubmitClicked: false,
    selectedFileTypeOption: null,
    selectedVendorNameOption: null,
  };

  setIsLoading = () => {
    const { isLoading } = this.state;
    this.setState({ isLoading: !isLoading, isSubmitClicked: true });
  };

  fetchUsers = async () => {
    const users = await getUsers();
    for (let i = 0; i < users.length; i++) {
      users[i]['total'] = 0;
      users[i]['net_amount'] = 0;
      users[i]['discount'] = 0;
    }
    this.setState({ users });
  };

  handleSubmit = async () => {
    const { file, selectedFileTypeOption, selectedVendorNameOption } = this.state;
    if (file && selectedFileTypeOption && selectedVendorNameOption) {
      this.setIsLoading();
      const { header, products } = await getProductsFromInvoice(file);

      let { products: updatedProducts } = this.state;
      for (let i = 0; i < products.length; i++) {
        let data = {};
        data['product_name'] = products[i]['product_name'];
        data['price'] = products[i]['price'];
        data['qty'] = products[i]['quantity'];
        data['id'] = products[i]['id'];
        data['selectedUsers'] = [];
        updatedProducts.push(data);
      }
      console.log(updatedProducts, 'updatedProducts');

      const UpdatedHeader = {
        total: header.total,
        net_amount: header.net_amount,
        discount: Math.abs(header.discount),
        delivery_fee: header.delivery_fee,
      };

      this.setState({
        header: UpdatedHeader,
        products: updatedProducts,
        file: null,
        selectedFileTypeOption: null,
        selectedVendorNameOption: null,
      });
      this.setIsLoading();
    } else {
      Swal.fire({
        title: 'Oops!',
        text: 'Please fill missing fileds',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  componentDidMount = () => {
    this.fetchUsers();
  };

  handleCheckBox = (product, user) => {
    let { header, products, users } = this.state;

    const productIndex = products.findIndex(p => p.id === product.id);
    if (productIndex === undefined) {
      return;
    }

    // checking if the user already exists,
    // whether to add the user or remove the user based on checkbox change
    const alreadySharedUsers = products[productIndex].selectedUsers;
    let addingUser = true;
    for (let j = 0; j < alreadySharedUsers.length; j++) {
      if (alreadySharedUsers[j].id === user.id) {
        addingUser = false;
        break;
      }
    }

    // finding the user index, so that we can update the total
    const userIndex = users.findIndex(u => u.id === user.id);
    const previousUsersCount = alreadySharedUsers.length;
    if (previousUsersCount === 0) {
      products[productIndex].selectedUsers.push(user);
      users[userIndex].total = parseFloat((users[userIndex].total + product.price).toFixed(2));
      users[userIndex].discount = parseFloat(
        ((Math.abs(header.discount) * users[userIndex].total) / header.total).toFixed(2),
      );
      users[userIndex].net_amount = parseFloat((users[userIndex].total - users[userIndex].discount).toFixed(2));
    } else {
      const previousSharePrice = parseFloat((products[productIndex].price / previousUsersCount).toFixed(2));

      // remove the previous share price
      for (let i = 0; i < products[productIndex].selectedUsers.length; i++) {
        const tmpUser = products[productIndex].selectedUsers[i];
        const tmpUserIndex = users.findIndex(u => u.id === tmpUser.id);
        if (tmpUserIndex !== undefined) {
          users[tmpUserIndex].total = parseFloat((users[tmpUserIndex].total - previousSharePrice).toFixed(2));
        }
      }

      // adding the current user to the shared users and calculating the share price
      if (addingUser) {
        products[productIndex].selectedUsers.push(user);
      } else {
        // find the user and delete from the users list
        products[productIndex].selectedUsers = products[productIndex].selectedUsers.filter(u => {
          return u.id !== user.id;
        });
      }

      const currentUserCount = products[productIndex].selectedUsers.length;

      const currentUserShare = parseFloat((products[productIndex].price / currentUserCount).toFixed(2));

      for (let i = 0; i < products[productIndex].selectedUsers.length; i++) {
        const tmpUser = products[productIndex].selectedUsers[i];
        const tmpUserIndex = users.findIndex(u => u.id === tmpUser.id);
        if (tmpUserIndex !== undefined) {
          users[tmpUserIndex].total = parseFloat((users[tmpUserIndex].total + currentUserShare).toFixed(2));
          users[tmpUserIndex].discount = parseFloat(
            ((Math.abs(header.discount) * users[tmpUserIndex].total) / header.total).toFixed(2),
          );
          users[tmpUserIndex].net_amount = parseFloat(
            (users[tmpUserIndex].total - users[tmpUserIndex].discount).toFixed(2),
          );
        }
      }
    }

    this.setState({ header, products, users });
  };

  handlePriceChange = (e, product) => {
    const newPrice = e.target.value;

    // reduce the old price in all users
    console.log(newPrice);
    console.log(product);
  };

  handleSelectFileType = selectedFileTypeOption => {
    this.setState({ selectedFileTypeOption });
  };

  handleSelectVendorName = selectedVendorNameOption => {
    this.setState({ selectedVendorNameOption });
  };

  handleFileChange = e => {
    const file = e.target.files[0];
    this.setState({ file });
  };

  render() {
    const {
      header,
      isLoading,
      isSubmitClicked,
      products,
      selectedFileTypeOption,
      selectedVendorNameOption,
      users,
    } = this.state;

    return (
      <main data-testid="quick-expense-page">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type of Invoice</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <Select
                      value={selectedFileTypeOption}
                      onChange={this.handleSelectFileType}
                      options={fileTypeOptions}
                    />
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Vendor Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <Select
                      value={selectedVendorNameOption}
                      onChange={this.handleSelectVendorName}
                      options={vendorNameOptions}
                    />
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Invoice upload </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                    <input className="form-control" type="file" id="formFile" onChange={this.handleFileChange} />
                  </dd>
                </div>
              </dl>
            </div>
            <div className="text-center p-5">
              <button
                id="submit"
                onClick={this.handleSubmit}
                className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
              >
                Submit
              </button>
            </div>
          </div>
          {!isLoading && products.length > 0 && users.length > 0 ? (
            <ProcessExpense
              header={header}
              products={products}
              users={users}
              handlePriceChange={this.handlePriceChange}
              handleCheckBox={this.handleCheckBox}
            />
          ) : (
            isSubmitClicked && <Spinner />
          )}
        </div>
      </main>
    );
  }
}

export default QuickExpense;
