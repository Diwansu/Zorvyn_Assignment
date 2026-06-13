import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Filter, SlidersHorizontal, Info, Calendar, X, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '../context/ToastContext';

/**
 * Records Page using shadcn/ui.
 */
const Records = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'Admin';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  
  // Form states (Create/Edit)
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formCategory, setFormCategory] = useState('Food');
  const [formDate, setFormDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState(null);

  const categories = ['Salary', 'Investment', 'Food', 'Entertainment', 'Utilities', 'Other'];

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterType && filterType !== 'ALL') queryParams.append('type', filterType);
      if (filterCategory && filterCategory !== 'ALL') queryParams.append('category', filterCategory);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (sortOption) queryParams.append('sort', sortOption);

      const response = await api.get(`/api/records?${queryParams.toString()}`);
      setRecords(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to retrieve records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filterType, filterCategory, startDate, endDate, sortOption]);

  const handleOpenAdd = () => {
    setFormAmount('');
    setFormType('expense');
    setFormCategory('Food');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormError(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (record) => {
    setSelectedRecord(record);
    setFormAmount(record.amount);
    setFormType(record.type);
    setFormCategory(record.category);
    setFormDate(new Date(record.date).toISOString().split('T')[0]);
    setFormNotes(record.notes || '');
    setFormError(null);
    setShowEditModal(true);
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formAmount || formAmount <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }

    try {
      await api.post('/api/records', {
        amount: Number(formAmount),
        type: formType,
        category: formCategory,
        date: formDate,
        notes: formNotes,
      });
      setShowAddModal(false);
      toast('Financial record created successfully.', 'success');
      fetchRecords();
    } catch (err) {
      setFormError(err.message || 'Failed to create record');
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!formAmount || formAmount <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }

    try {
      await api.put(`/api/records/${selectedRecord._id}`, {
        amount: Number(formAmount),
        type: formType,
        category: formCategory,
        date: formDate,
        notes: formNotes,
      });
      setShowEditModal(false);
      toast('Financial record updated successfully.', 'success');
      fetchRecords();
    } catch (err) {
      setFormError(err.message || 'Failed to update record');
    }
  };

  const handleOpenDelete = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    try {
      await api.delete(`/api/records/${recordToDelete._id}`);
      setShowDeleteModal(false);
      setRecordToDelete(null);
      toast('Financial record deleted successfully.', 'success');
      fetchRecords();
    } catch (err) {
      toast(err.message || 'Failed to delete record', 'error');
    }
  };

  const resetFilters = () => {
    setFilterType('ALL');
    setFilterCategory('ALL');
    setStartDate('');
    setEndDate('');
    setSortOption('newest');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Financial Records
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin ? 'Manage, update, and search transaction records.' : 'Read-only access to transaction history and analytics.'}
          </p>
        </div>

        {isAdmin && (
          <Button 
            onClick={handleOpenAdd} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Record</span>
          </Button>
        )}
      </div>

      {/* Filters Card */}
      <Card className="border-slate-800 bg-slate-900/40 p-5 space-y-4 shadow-md">
        <div className="flex items-center gap-2 text-slate-355 text-sm font-semibold">
          <Filter className="h-4.5 w-4.5 text-indigo-400" />
          <span>Filters & Sort Options</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Filter Type */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs">Type</Label>
            <Select value={filterType} onValueChange={(val) => setFilterType(val)}>
              <SelectTrigger className="bg-slate-950/40 border-slate-800 text-slate-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="ALL" className="focus:bg-slate-800 focus:text-white">All Types</SelectItem>
                <SelectItem value="income" className="focus:bg-slate-800 focus:text-white">Income</SelectItem>
                <SelectItem value="expense" className="focus:bg-slate-800 focus:text-white">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Category */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs">Category</Label>
            <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
              <SelectTrigger className="bg-slate-950/40 border-slate-800 text-slate-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="ALL" className="focus:bg-slate-800 focus:text-white">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="focus:bg-slate-800 focus:text-white">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs">From Date</Label>
            <Input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="bg-slate-950/40 border-slate-800 text-slate-200" 
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs">To Date</Label>
            <Input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="bg-slate-950/40 border-slate-800 text-slate-200" 
            />
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <Label className="text-slate-400 text-xs">Sort By</Label>
            <Select value={sortOption} onValueChange={(val) => setSortOption(val)}>
              <SelectTrigger className="bg-slate-950/40 border-slate-800 text-slate-200">
                <SelectValue placeholder="Newest Date" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="newest" className="focus:bg-slate-800 focus:text-white">Newest Date</SelectItem>
                <SelectItem value="oldest" className="focus:bg-slate-800 focus:text-white">Oldest Date</SelectItem>
                <SelectItem value="amount_high" className="focus:bg-slate-800 focus:text-white">Highest Amount</SelectItem>
                <SelectItem value="amount_low" className="focus:bg-slate-800 focus:text-white">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={resetFilters} 
            variant="outline" 
            size="sm" 
            className="border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </Button>
        </div>
      </Card>

      {/* Table Container */}
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
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Info className="h-8 w-8 mx-auto mb-3 text-cyan-400" />
            <p>No financial records match your criteria.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-900/60 border-slate-800">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-semibold px-6 py-4">DATE</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">NOTES / DESCRIPTION</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">CATEGORY</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">TYPE</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">AMOUNT</TableHead>
                <TableHead className="text-slate-400 font-semibold px-6 py-4">LOGGED BY</TableHead>
                {isAdmin && <th className="text-slate-400 font-semibold px-6 py-4 text-right">ACTIONS</th>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id} className="border-slate-800/60 hover:bg-slate-800/10">
                  <TableCell className="px-6 py-4.5 font-medium whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-6 py-4.5 text-slate-200 font-medium">
                    {record.notes || <span className="text-slate-500 italic font-normal">No notes</span>}
                  </TableCell>
                  <TableCell className="px-6 py-4.5">
                    <span className="inline-flex px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                      {record.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase
                      ${record.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell className={`px-6 py-4.5 font-bold text-sm
                    ${record.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </TableCell>
                  <TableCell className="px-6 py-4.5 text-xs text-slate-450">
                    {record.createdBy?.name || 'Admin'}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="px-6 py-4.5 text-right">
                      <div className="inline-flex gap-2">
                        <Button 
                          onClick={() => handleOpenEdit(record)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-cyan-400 hover:text-white hover:bg-cyan-500/10"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleOpenDelete(record)} 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-400 hover:text-white hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* CREATE MODAL */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Add Financial Record</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 animate-slide-up">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateRecord} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Type</Label>
                <Select value={formType} onValueChange={(val) => setFormType(val)}>
                  <SelectTrigger className="bg-slate-950/40 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="expense" className="focus:bg-slate-800">Expense</SelectItem>
                    <SelectItem value="income" className="focus:bg-slate-800">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Category</Label>
                <Select value={formCategory} onValueChange={(val) => setFormCategory(val)}>
                  <SelectTrigger className="bg-slate-950/40 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    {categories.map(c => <SelectItem key={c} value={c} className="focus:bg-slate-800">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Amount (USD)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  value={formAmount} 
                  onChange={(e) => setFormAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="bg-slate-950/40 border-slate-800 text-white" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Date</Label>
                <Input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="bg-slate-950/40 border-slate-800 text-white" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Description / Notes</Label>
              <textarea 
                rows="3" 
                maxLength="500" 
                value={formNotes} 
                onChange={(e) => setFormNotes(e.target.value)} 
                placeholder="Enter transaction details..." 
                className="flex w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" onClick={() => setShowAddModal(false)} variant="secondary" className="border-slate-800 text-slate-300">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">Edit Financial Record</DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 animate-slide-up">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateRecord} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Type</Label>
                <Select value={formType} onValueChange={(val) => setFormType(val)}>
                  <SelectTrigger className="bg-slate-950/40 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="expense" className="focus:bg-slate-800">Expense</SelectItem>
                    <SelectItem value="income" className="focus:bg-slate-800">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Category</Label>
                <Select value={formCategory} onValueChange={(val) => setFormCategory(val)}>
                  <SelectTrigger className="bg-slate-950/40 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    {categories.map(c => <SelectItem key={c} value={c} className="focus:bg-slate-800">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300">Amount (USD)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0.01" 
                  value={formAmount} 
                  onChange={(e) => setFormAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="bg-slate-950/40 border-slate-800 text-white" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300">Date</Label>
                <Input 
                  type="date" 
                  value={formDate} 
                  onChange={(e) => setFormDate(e.target.value)} 
                  className="bg-slate-950/40 border-slate-800 text-white" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-300">Description / Notes</Label>
              <textarea 
                rows="3" 
                maxLength="500" 
                value={formNotes} 
                onChange={(e) => setFormNotes(e.target.value)} 
                placeholder="Enter transaction details..." 
                className="flex w-full rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" onClick={() => setShowEditModal(false)} variant="secondary" className="border-slate-800 text-slate-300">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-sm">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              <span>Delete Record</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Are you sure you want to permanently delete this financial record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {recordToDelete && (
            <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-850 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Record Details:</div>
              <div className="text-sm font-semibold text-white">
                {recordToDelete.type === 'income' ? '+' : '-'}{formatCurrency(recordToDelete.amount)} — {recordToDelete.category}
              </div>
              {recordToDelete.notes && (
                <div className="text-xs text-slate-400 italic font-medium truncate">"{recordToDelete.notes}"</div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" onClick={() => setShowDeleteModal(false)} variant="secondary" className="border-slate-800 text-slate-300">
              Cancel
            </Button>
            <Button type="button" onClick={confirmDeleteRecord} className="bg-rose-600 hover:bg-rose-700 text-white border-none">
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Records;
