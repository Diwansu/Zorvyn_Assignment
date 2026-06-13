import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Users, Info, ShieldAlert, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * User Management Page using shadcn/ui.
 */
const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to retrieve users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser._id) {
      toast("Self-modification warning: Changing your own admin role is locked.", 'info');
      return;
    }

    setUpdatingId(userId);
    try {
      const response = await api.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: response.user.role } : u));
      toast(`User role updated to ${newRole} successfully.`, 'success');
    } catch (err) {
      toast(err.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (userId === currentUser._id) {
      toast("Operation rejected: You cannot deactivate your own administrative account.", 'error');
      return;
    }

    setUpdatingId(userId);
    try {
      const response = await api.put(`/api/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: response.user.status } : u));
      toast(`User account ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`, 'success');
    } catch (err) {
      toast(err.message || 'Failed to update user status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Header Panel */}
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Deactivate accounts or reassign user roles across the portal.
        </p>
      </div>

      {/* Warning Alert Banner */}
      <Card className="border-indigo-500/20 bg-indigo-500/10 p-4 shadow-sm">
        <div className="flex gap-3 items-center">
          <ShieldAlert className="h-5 w-5 text-indigo-400 shrink-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Security Controls:</strong> Deactivating a user switches their status to <code>inactive</code>. The system automatically invalidates active sessions, blocking login requests and active API calls for that account immediately.
          </p>
        </div>
      </Card>

      {/* Users Table Container */}
      <Card className="border-slate-800 bg-slate-900/40 overflow-hidden shadow-md">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-850 border-t-indigo-500" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-400">
            <Info className="h-8 w-8 mx-auto mb-3" />
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Users className="h-8 w-8 mx-auto mb-3 text-indigo-400" />
            <p>No registered users found in the database.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-900/60 border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold px-6 py-4">NAME</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">EMAIL ADDRESS</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">ROLE</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">STATUS</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">ACCOUNT ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item) => {
                const isSelf = item._id === currentUser._id;
                return (
                  <TableRow key={item._id} className="border-slate-800/60 hover:bg-slate-800/10">
                    <TableCell className="px-6 py-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {isSelf && (
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-450">{item.email}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-500" />
                        <Select 
                          value={item.role} 
                          onValueChange={(val) => handleRoleChange(item._id, val)}
                          disabled={isSelf || updatingId === item._id}
                        >
                          <SelectTrigger className="h-8 w-28 bg-slate-950/40 border-slate-800 text-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="Viewer" className="focus:bg-slate-800">Viewer</SelectItem>
                            <SelectItem value="Analyst" className="focus:bg-slate-800">Analyst</SelectItem>
                            <SelectItem value="Admin" className="focus:bg-slate-800">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border
                        ${item.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {isSelf ? (
                        <span className="text-xs text-slate-500 italic">Protected</span>
                      ) : (
                        <Button
                          disabled={updatingId === item._id}
                          onClick={() => handleStatusChange(item._id, item.status === 'active' ? 'inactive' : 'active')}
                          variant="outline"
                          size="sm"
                          className={`h-8 gap-1.5 transition-all
                            ${item.status === 'active' 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'}`}
                        >
                          {item.status === 'active' ? (
                            <>
                              <XCircle className="h-4 w-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Activate</span>
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
