import React, { useState } from 'react';
import { CustomerDetails } from '../../types/invoice.ts';
import { Users, BookmarkCheck, UserPlus } from 'lucide-react';
import { getSavedClients, saveClient } from '../../utils/storage.ts';

interface ClientFormProps {
  client: CustomerDetails;
  onChange: (client: CustomerDetails) => void;
  cloudCustomers?: CustomerDetails[];
  onSaveCustomerToCloud?: (customer: CustomerDetails) => Promise<void>;
}

export const ClientForm: React.FC<ClientFormProps> = ({ 
  client, 
  onChange,
  cloudCustomers,
  onSaveCustomerToCloud,
}) => {
  const [savedClients, setSavedClients] = useState<CustomerDetails[]>(() => getSavedClients());
  const [savedNotification, setSavedNotification] = useState(false);
  const [showShipping, setShowShipping] = useState(Boolean(client.shippingAddress));

  // Combine local and cloud customers without duplicates
  const customerList = cloudCustomers && cloudCustomers.length > 0 ? cloudCustomers : savedClients;

  const handleFieldChange = (field: keyof CustomerDetails, value: any) => {
    onChange({ ...client, [field]: value });
  };

  const handleSaveToAddressBook = async () => {
    if (!client.name && !client.companyName) {
      alert('Please enter a client name or company name first.');
      return;
    }
    if (onSaveCustomerToCloud) {
      await onSaveCustomerToCloud(client);
    } else {
      const updated = saveClient(client);
      setSavedClients(updated);
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleSelectSavedClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = customerList.find(c => c.name === e.target.value || c.companyName === e.target.value);
    if (selected) {
      onChange(selected);
      if (selected.shippingAddress) setShowShipping(true);
    }
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Customer / Recipient Details</h3>
        </div>

        <div className="flex items-center gap-2">
          {customerList.length > 0 && (
            <select
              aria-label="Load saved customer"
              onChange={handleSelectSavedClient}
              defaultValue=""
              className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700"
            >
              <option value="" disabled>Load Saved Customer...</option>
              {customerList.map((c, i) => (
                <option key={i} value={c.name || c.companyName}>
                  {c.name || c.companyName} {c.companyName ? `(${c.companyName})` : ''}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleSaveToAddressBook}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{savedNotification ? 'Saved to Customers!' : 'Save Customer'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Contact Person Name</label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Company / Organization Name</label>
          <input
            type="text"
            value={client.companyName || ''}
            onChange={(e) => handleFieldChange('companyName', e.target.value)}
            placeholder="Apex Technologies LLC"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="accounts@clientdomain.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={client.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">Billing Address</label>
          <textarea
            rows={2}
            value={client.billingAddress}
            onChange={(e) => handleFieldChange('billingAddress', e.target.value)}
            placeholder="100 Market St, Suite 500, Austin, TX 78701"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setShowShipping(!showShipping)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showShipping ? '— Hide Shipping Address' : '+ Add Separate Shipping Address'}
          </button>
          
          <div className="w-1/2">
            <input
              type="text"
              value={client.taxId || ''}
              onChange={(e) => handleFieldChange('taxId', e.target.value)}
              placeholder="Client Tax ID / VAT (optional)"
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {showShipping && (
          <div className="sm:col-span-2 animate-in fade-in duration-200">
            <label className="block font-medium text-slate-700 mb-1">Shipping Address</label>
            <textarea
              rows={2}
              value={client.shippingAddress || ''}
              onChange={(e) => handleFieldChange('shippingAddress', e.target.value)}
              placeholder="Warehouse Dock 4, 200 Industrial Way, Austin, TX 78702"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
