import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isFirestoreEnabled } from '../../firebase';

export function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/owner/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <div className="font-body-md text-on-surface bg-background min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col p-md z-40 bg-surface-container w-64 transition-all duration-200 ease-in-out border-r border-outline-variant/30">
        <div className="mb-xl px-sm">
          <h2 className="font-h3 text-h3 font-bold text-primary">PrintEase Admin</h2>
          <p className="font-label-md text-label-md text-on-surface-variant mt-xs">Operational Excellence</p>
        </div>
        <nav className="flex-1 space-y-sm px-sm">
          <NavLink 
            to="/owner/dashboard/active" 
            className={({isActive}) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md transition-all ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">pending_actions</span>
            <span>Active Orders</span>
          </NavLink>
          <NavLink 
            to="/owner/dashboard/records" 
            className={({isActive}) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md transition-all ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">history</span>
            <span>Records</span>
          </NavLink>
          <NavLink 
            to="/owner/dashboard/settings" 
            className={({isActive}) => `flex items-center gap-md px-md py-sm rounded-lg font-label-md transition-all ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </NavLink>
          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center gap-md px-md py-sm rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container-high transition-all mt-lg border-t border-outline-variant/30 pt-md"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Shop</span>
          </button>
        </nav>
        
        <div className="mt-auto px-sm pt-md border-t border-outline-variant">
          <button onClick={handleLogout} className="w-full flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 ease-in-out cursor-pointer font-label-md">
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full pl-72 pr-lg py-sm fixed top-0 bg-surface border-b border-outline-variant z-30 shadow-sm">
        <div className="flex items-center gap-md">
          <h1 className="font-h3 text-h3 font-semibold text-on-surface">Dashboard</h1>
          {!isFirestoreEnabled && (
            <span className="bg-amber-100 text-amber-800 text-[10px] px-sm py-0.5 rounded-full font-bold uppercase tracking-wider">Demo Mode</span>
          )}
        </div>
        <div className="flex items-center gap-lg">
          {!isFirestoreEnabled && (
            <button 
              onClick={() => {
                const mockOrder = {
                  customerName: "John Smith (Demo)",
                  customerPhone: "555-0123",
                  files: [{ fileName: "document.pdf", pageCount: 5, downloadURL: "#" }],
                  totalPages: 5,
                  copies: 1,
                  colorMode: "bw",
                  sides: "single",
                  paperSize: "A4",
                  specialInstructions: "Simulated order for testing UI",
                  totalAmount: 10.0,
                  status: "pending",
                  isPaid: false
                };
                window.dispatchEvent(new CustomEvent('simulate-order', { detail: mockOrder }));
              }}
              className="flex items-center gap-xs px-md py-1.5 bg-secondary text-white rounded-lg text-caption font-bold hover:opacity-90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Simulate Order
            </button>
          )}
          <div className="flex items-center gap-md">
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors flex items-center gap-sm">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>account_circle</span>
              <span className="font-label-md text-label-md">{user?.email || 'Manager'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 pt-20 p-lg min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
