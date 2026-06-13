import React, { useState } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '../context/ToastContext';

/**
 * Top Navbar component with user profile widget and logout confirmation dialog.
 */
const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Analyst': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 h-16 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl flex items-center justify-between px-6 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => toggleSidebar(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-full hover:bg-slate-800 text-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent">
            ZORVYN
          </span>
        </div>

        <div className="flex items-center gap-4.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-slate-100">{user.name}</span>
              <span className={`text-[10px] font-bold tracking-wider uppercase border rounded-md px-1.5 py-0.5 mt-1 ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          <Button 
            onClick={() => setShowLogoutConfirm(true)}
            variant="ghost"
            size="icon"
            title="Sign Out"
            className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 hover:scale-105 transition-all"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

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

export default Navbar;
