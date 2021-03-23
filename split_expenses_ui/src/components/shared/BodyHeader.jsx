import React, { Component } from 'react';

class BodyHeader extends Component {
  state = {};
  render() {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Welcome User!!</h1>
        </div>
      </header>
    );
  }
}

export default BodyHeader;
