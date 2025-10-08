import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { getCamperVanById } from '../services/camperVehicleDataService';
import { Button } from './Button';
import { AdminService } from '../pages/admin';

// Booking Management Table Component
export function BookingManagementTable({ onEditBooking, onViewDetails }) {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters, sortBy, sortOrder]);

  const loadBookings = async () => {
    try {
      AdminService.requireAdmin();
      const allBookings = bookingService.getAllBookings();
      setBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Date range filter
    const now = new Date();
    if (filters.dateRange !== 'all') {
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.createdAt) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.createdAt) >= monthAgo);
          break;
      }
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.confirmationNumber?.toLowerCase().includes(searchLower) ||
        booking.primaryDriver?.firstName?.toLowerCase().includes(searchLower) ||
        booking.primaryDriver?.lastName?.toLowerCase().includes(searchLower) ||
        booking.primaryDriver?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortBy === 'customerName') {
        aValue = `${a.primaryDriver?.firstName || ''} ${a.primaryDriver?.lastName || ''}`;
        bValue = `${b.primaryDriver?.firstName || ''} ${b.primaryDriver?.lastName || ''}`;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'in-progress': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  const getVanName = (vanId) => {
    const van = getCamperVanById(vanId);
    return van ? van.name : 'Unknown Van';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-zinc-400">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search bookings..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-500 dark:placeholder-zinc-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="startDate-desc">Check-in Date (Latest)</option>
              <option value="startDate-asc">Check-in Date (Earliest)</option>
              <option value="totalAmount-desc">Amount (High to Low)</option>
              <option value="totalAmount-asc">Amount (Low to High)</option>
              <option value="customerName-asc">Customer Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Van
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800/30 divide-y divide-gray-200 dark:divide-zinc-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {booking.confirmationNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {booking.primaryDriver?.firstName} {booking.primaryDriver?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">
                        {booking.primaryDriver?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-zinc-100">
                      {getVanName(booking.vanId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-zinc-100">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-zinc-400">
                        to {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                      ${booking.totalAmount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-zinc-400">
                      {booking.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(booking)}
                      >
                        View
                      </Button>
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        className="text-xs border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredBookings.length}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            ${filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredBookings.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending Bookings</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {filteredBookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600">Confirmed Bookings</div>
        </div>
      </div>
    </div>
  );
}

// Booking Details Modal Component
export function BookingDetailsModal({ booking, isOpen, onClose, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [editedBooking, setEditedBooking] = useState(booking);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setEditedBooking(booking);
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSave = async () => {
    setProcessing(true);
    try {
      await bookingService.updateBooking(booking.id, editedBooking);
      onUpdate();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRefund = async () => {
    if (booking.paymentId && window.confirm('Are you sure you want to process a refund?')) {
      setProcessing(true);
      try {
        await paymentService.refundPayment(booking.paymentId, 'Admin refund');
        await bookingService.updateBookingStatus(booking.id, 'cancelled');
        onUpdate();
      } catch (error) {
        console.error('Error processing refund:', error);
      } finally {
        setProcessing(false);
      }
    }
  };

  const van = getCamperVanById(booking.vanId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Booking Details - {booking.confirmationNumber}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                disabled={processing}
              >
                {editMode ? 'Cancel Edit' : 'Edit'}
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  {editMode ? (
                    <select
                      value={editedBooking.status}
                      onChange={(e) => setEditedBooking(prev => ({ ...prev, status: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{booking.status}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Van</label>
                  <p className="mt-1 text-sm text-gray-900">{van?.name || booking.vanId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-in</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(booking.startDate).toLocaleDateString()} at {booking.pickupTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Check-out</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(booking.endDate).toLocaleDateString()} at {booking.returnTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Guests</label>
                  <p className="mt-1 text-sm text-gray-900">{booking.guestCount}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {booking.primaryDriver?.firstName} {booking.primaryDriver?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{booking.primaryDriver?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{booking.primaryDriver?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">License</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {booking.primaryDriver?.licenseNumber} ({booking.primaryDriver?.licenseCountry})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Total Amount</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">
                  ${booking.totalAmount?.toLocaleString() || '0'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payment Status</label>
                <p className="mt-1 text-sm text-gray-900">{booking.paymentStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payment ID</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">
                  {booking.paymentId || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Special Requests</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {booking.paymentStatus === 'paid' && (
                <Button
                  variant="outline"
                  onClick={handleRefund}
                  disabled={processing}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Process Refund
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {editMode && (
                <Button
                  onClick={handleSave}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
