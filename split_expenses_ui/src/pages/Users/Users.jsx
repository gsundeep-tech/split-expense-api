import React, { Component } from 'react';
import { getUsers, postUsers } from '../../services';
import { Dialog } from '../../components/shared/Dialog';
import { Spinner } from '../../components/Spinner';

class Users extends Component {
  state = {
    users: [],
    isDisplayDialog: false,
    isLoading: true,
    values: {
      user_name: '',
      email_id: '',
      phone_number: null,
    },
  };

  fetchUsers = async () => {
    const users = await getUsers();
    this.setState({ users, isLoading: false });
  };

  componentDidMount = () => {
    this.fetchUsers();
  };

  handleAddUser = () => {
    const { isDisplayDialog } = this.state;
    this.setState({ isDisplayDialog: !isDisplayDialog });
  };

  handleSubmit = async () => {
    const { values } = this.state;
    await postUsers(values);
    await this.fetchUsers();
    this.handleAddUser();
  };

  handleChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    const { values } = this.state;
    if (id === 'user_name') {
      values.user_name = value;
    } else if (id === 'email_id') {
      values.email_id = value;
    } else if (id === 'phone_number') {
      values.phone_number = value;
    }
    this.setState({ values });
  };

  render() {
    const { users, isDisplayDialog, isLoading, values } = this.state;
    return (
      <main data-testid="users-page">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <button
            onClick={this.handleAddUser}
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
                      {!isLoading && (
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Mobile Number
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                      )}
                      <tbody className="bg-white divide-y divide-gray-200">
                        {!isLoading ? (
                          users &&
                          users.length > 0 &&
                          users.map(user => {
                            return (
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{user.phone_number}</div>
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
            title="Add an user"
            isDialogOpen={isDisplayDialog}
            handleCloseDialog={this.handleAddUser}
            handleSubmit={this.handleSubmit}
          >
            <div className="bg-white rounded px-8 pt-6 pb-8 flex flex-col">
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="user_name"
                  >
                    user name
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                    id="user_name"
                    type="text"
                    placeholder="eg: Jhon"
                    value={values.user_name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="phone_number"
                  >
                    phone Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                    id="phone_number"
                    type="text"
                    placeholder="eg: 1234567890"
                    value={values.phone_number}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                    for="email_id"
                  >
                    Email id
                  </label>
                  <input
                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                    id="email_id"
                    type="text"
                    placeholder="eg: abc@gmail.com"
                    value={values.email_id}
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

export default Users;
