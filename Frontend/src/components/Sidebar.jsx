import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Users, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '../context/ToastContext';

/**
 * Sidebar Navigation component that adapts links based on User Roles.
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <aside 
        className={`fixed top-20 bottom-4 w-64 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col justify-between z-45 transition-all duration-300 shadow-xl
          ${isOpen ? 'left-4' : '-left-80'} lg:left-4 lg:z-10`}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <Wallet className="h-6 w-6 text-indigo-400" />
            <h3 className="text-base font-bold tracking-wider text-slate-100 uppercase">ZORVYN PORTAL</h3>
          </div>

          <nav className="flex flex-col gap-1.5">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}`}
              onClick={() => toggleSidebar(false)}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              <span>Dashboard</span>
            </NavLink>

            {/* Analyst and Admin only */}
            {(user.role === 'Admin' || user.role === 'Analyst') && (
              <NavLink 
                to="/records" 
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}`}
                onClick={() => toggleSidebar(false)}
              >
                <ReceiptText className="h-4.5 w-4.5" />
                <span>Financial Records</span>
              </NavLink>
            )}

            {/* Admin only */}
            {user.role === 'Admin' && (
              <NavLink 
                to="/users" 
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'}`}
                onClick={() => toggleSidebar(false)}
              >
                <Users className="h-4.5 w-4.5" />
                <span>User Management</span>
              </NavLink>
            )}
          </nav>
        </div>

        <div>
          <Button 
            onClick={() => setShowLogoutConfirm(true)}
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-3 px-4 py-6"
          >
            <LogOut className="h-4.5 w-4.5 text-rose-500" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-sm">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <LogOut className="h-5 w-5 text-rose-500" />
              <span>Sign Out</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to sign out of your session? You will need to log back in to access the portal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button 
              type="button" 
              onClick={() => setShowLogoutConfirm(false)} 
              variant="secondary" 
              className="border-slate-800 text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                toast('Logged out successfully.', 'info');
                logout();
              }} 
              className="bg-rose-600 hover:bg-rose-700 text-white border-none"
            >
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
