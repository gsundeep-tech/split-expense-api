import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { ProcessExpense } from "../../components/ProcessExpense";
import { Spinner } from "../../components/Spinner";
import { getProductsFromInvoice, getUsers } from "../../services";

class QuickExpense extends Component {
  state = {
    users: [],
    products: [],
    file: null,
    header: {},
    isLoading: false,
    isSubmitClicked: false
  };

  setIsLoading = () => {
    const { isLoading } = this.state;
    this.setState({ isLoading: !isLoading, isSubmitClicked: true });
  };

  fetchUsers = async () => {
    const users = await getUsers();
    for (let i = 0; i < users.length; i++) {
      users[i]["total"] = 0;
      users[i]["netAmount"] = 0;
      users[i]["discount"] = 0;
    }
    this.setState({ users });
  };

  handleSubmit = async () => {
    this.setIsLoading();
    const { header, products } = await getProductsFromInvoice(this.state.file);

    let updatedState = this.state;
    for (let i = 0; i < products.length; i++) {
      let data = {};
      data["product_name"] = products[i]["product_name"];
      data["price"] = products[i]["price"];
      data["qty"] = products[i]["quantity"];
      data["id"] = products[i]["id"];
      data["selectedUsers"] = [];
      updatedState.products.push(data);
    }
    console.log(updatedState);

    updatedState.header = {
      total: header.total,
      netAmount: header.net_amount,
      discount: Math.abs(header.discount),
      deliveryFee: header.delivery_fee,
    };

    this.setState({ updatedState });
    this.setIsLoading();
  };

  componentDidMount = () => {
    this.fetchUsers();
  };

  getFileSize = (size) => {
    let fileSize = 0;
    if (size > 1024) {
      if (size > 1048576) {
        fileSize = Math.round(size / 1048576) + "mb";
      } else {
        fileSize = Math.round(size / 1024) + "kb";
      }
    } else {
      fileSize = size + "b";
    }
    return fileSize;
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

  handleDrop = (acceptedFiles) => {
    console.log(acceptedFiles, "acceptedFiles");
    const file = acceptedFiles[0] || null;
    this.setState({ file });
  };

  render() {
    const { file, header, isLoading, isSubmitClicked, products, users } = this.state;

    if(isLoading) {
      return <Spinner />
    }

    return (
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div
            aria-label="File Upload Modal"
            className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
          >
            <section className="h-full overflow-auto p-8 w-full h-full flex flex-col">
              <Dropzone onDrop={this.handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                      <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                        <span>Drag and drop your</span>&nbsp;
                        <span>
                          Lazada Invoice file anywhere or click to select file
                        </span>
                      </p>
                      <button
                        style={{ background: "none" }}
                        id="button"
                        onClick={this.handleDrop}
                        className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                      >
                        <i>
                          <svg
                            className="fill-current w-12 h-12 mb-3 text-blue-700"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                          </svg>
                        </i>
                      </button>
                    </header>
                  </div>
                )}
              </Dropzone>
              <div>
                <h1 className="pt-5 pb-3 font-semibold sm:text-lg text-gray-900">
                  To Upload
                </h1>
                <ul id="gallery" className="flex flex-1 flex-wrap -m-1 px-1">
                  {file ? (
                    <li>
                      <div className="grid grid-cols-6 gap-4">
                        <div>
                          <h1>{file.name}</h1>
                          <span className="delete">{file?.url}</span>
                          <span className="size">
                            {this.getFileSize(file.size)}
                          </span>
                        </div>
                        <div className="col-end-12">
                          <button
                            id="submit"
                            onClick={this.handleSubmit}
                            disabled={isSubmitClicked}
                            className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li
                      id="empty"
                      className="h-full w-full text-center flex flex-col items-center justify-center items-center"
                    >
                      <img
                        className="mx-auto w-32"
                        src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                        alt="no data"
                      />
                      <span className="text-small text-gray-500">
                        No files selected
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </section>
          </div>
           {(!isLoading && products.length > 0 && users.length > 0) ?<ProcessExpense
            header={header}
            products={products}
            users={users}
            handlePriceChange={this.handlePriceChange}
            handleCheckBox={this.handleCheckBox}
          /> : (isSubmitClicked && <Spinner />)}
        </div>
      </main>
    );
  }
}

export default QuickExpense;
