import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();

  const getLinkClassNames = linkName => {
    const isActive = location.pathname === linkName;
    const classNames = isActive
      ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';
    return classNames;
  };

  const navLinks = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Users',
      link: '/users',
    },
    {
      name: 'Products',
      link: '/products',
    },
    {
      name: 'Quick Expense',
      link: '/quick',
    },
    {
      name: 'Reports',
      link: '/reports',
    },
  ];

  return (
    <nav className="bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white text-2xl font-extrabold">Split Expense</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map(navLink => {
                  const { name, link } = navLink;
                  return (
                    <Link to={link} key={name} className={getLinkClassNames(link)}>
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
