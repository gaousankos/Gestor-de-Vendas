import React from 'react';
import type { UserProfile } from '../types';
import { UserRole, View } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  userProfiles: UserProfile[];
}

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-solar-blue-700 text-white'
        : 'text-gray-300 hover:bg-solar-blue-500/75 hover:text-white'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentUser, currentView, setCurrentView, userProfiles }) => {

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = userProfiles.find(u => u.id === e.target.value);
        if (selectedUser) {
            setCurrentUser(selectedUser);
            // Reset view to dashboard on user switch to avoid permission issues
            setCurrentView(View.Dashboard);
        }
    };
    
    const admins = userProfiles.filter(u => u.role === UserRole.Admin);
    const managers = userProfiles.filter(u => u.role === UserRole.Manager);
    const salespeople = userProfiles.filter(u => u.role === UserRole.Salesperson);

  return (
    <header className="bg-solar-blue-600 dark:bg-slate-900/70 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-solar-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5s2.47-5.5 5.5-5.5 5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5z"/>
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    <path d="M20 12c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8zm-8 6c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              <span>Multiluz Solar</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavButton active={currentView === View.Dashboard} onClick={() => setCurrentView(View.Dashboard)}>Dashboard</NavButton>
                <NavButton active={currentView === View.List || currentView === View.Detail} onClick={() => setCurrentView(View.List)}>Pedidos</NavButton>
                <NavButton active={currentView === View.Payments} onClick={() => setCurrentView(View.Payments)}>Recebimentos</NavButton>
                 {currentUser.role === UserRole.Admin && (
                    <NavButton active={currentView === View.Commissions} onClick={() => setCurrentView(View.Commissions)}>Comissões</NavButton>
                )}
                {(currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager) && (
                    <NavButton active={currentView === View.Salespeople} onClick={() => setCurrentView(View.Salespeople)}>Gestão de Consultores</NavButton>
                )}
                 {currentUser.role === UserRole.Admin && (
                    <NavButton active={currentView === View.Profiles} onClick={() => setCurrentView(View.Profiles)}>Gestão de Perfis</NavButton>
                )}
                 {currentUser.role === UserRole.Admin && (
                    <NavButton active={currentView === View.Settings} onClick={() => setCurrentView(View.Settings)}>Configurações</NavButton>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white text-sm hidden sm:block">
                {currentUser.name} <span className="text-xs opacity-75">({currentUser.role})</span>
            </span>
             <select 
                value={currentUser.id}
                onChange={handleUserChange}
                className="bg-solar-blue-500 text-white border-solar-blue-400 rounded-md py-1 pl-2 pr-8 text-sm focus:ring-solar-yellow-400 focus:border-solar-yellow-400"
                aria-label="Selecionar usuário"
            >
                <optgroup label="Admins">
                    {admins.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                </optgroup>
                <optgroup label="Gestores">
                    {managers.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                </optgroup>
                <optgroup label="Vendedores">
                    {salespeople.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                    ))}
                </optgroup>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
