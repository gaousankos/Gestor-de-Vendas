
import React from 'react';
import type { Salesperson } from '../types';
import { UserRole, View } from '../types';

interface HeaderProps {
  currentUser: { name: string; role: UserRole };
  setCurrentUser: (user: { name: string; role: UserRole }) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  salespeople: Salesperson[];
}

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-solar-yellow-400">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path><path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path><path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentUser, currentView, setCurrentView, salespeople }) => {

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    let name = 'Admin';
    if(role === UserRole.Manager) name = 'Gestor Chefe';
    if(role === UserRole.Salesperson) name = salespeople[0]?.name || 'Ana Costa';
    setCurrentUser({ name, role });
  };
  
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     setCurrentUser({ name: e.target.value, role: UserRole.Salesperson });
  }

  const navItems = [View.Dashboard, View.List, View.Payments];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <SunIcon />
            <h1 className="text-2xl font-bold text-solar-blue-700 dark:text-solar-yellow-400">
              Multiluz Solar
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-2">
                {navItems.map((view) => (
                    <button
                        key={view}
                        onClick={() => setCurrentView(view)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentView === view
                                ? 'bg-solar-blue-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {view}
                    </button>
                ))}
             </div>
            <div className="flex items-center space-x-2">
              <select
                id="role"
                value={currentUser.role}
                onChange={handleRoleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-solar-blue-500 focus:border-solar-blue-500 sm:text-sm rounded-md"
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
               {currentUser.role === UserRole.Salesperson && (
                  <select
                    id="user"
                    value={currentUser.name}
                    onChange={handleUserChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-solar-blue-500 focus:border-solar-blue-500 sm:text-sm rounded-md"
                  >
                    {salespeople.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
               )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;