import React, { useRef } from 'react';
import { BusinessDetails } from '../../types/invoice.ts';
import { Building2, Upload, Trash2, Image } from 'lucide-react';

interface SenderFormProps {
  sender: BusinessDetails;
  onChange: (sender: BusinessDetails) => void;
}

export const SenderForm: React.FC<SenderFormProps> = ({ sender, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof BusinessDetails, value: any) => {
    onChange({ ...sender, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image file size should be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleFieldChange('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleFieldChange('logoUrl', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Your Business / Sender Details</h3>
        </div>
      </div>

      {/* Logo Upload Section */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">Business Logo</label>
        {sender.logoUrl ? (
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <img src={sender.logoUrl} alt="Company logo preview" className="h-12 w-auto object-contain bg-white p-1 rounded border border-slate-200" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-2.5 py-1 text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 font-medium"
              >
                Change Logo
              </button>
              <button
                type="button"
                onClick={removeLogo}
                className="text-xs px-2.5 py-1 text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 transition-colors rounded-lg p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1"
          >
            <Upload className="w-5 h-5 text-slate-400" />
            <p className="text-xs font-medium text-slate-700">Upload Company Logo (PNG, JPG, SVG)</p>
            <p className="text-[11px] text-slate-400">Max size 2MB · Processed locally in browser</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">Company / Individual Name *</label>
          <input
            type="text"
            required
            value={sender.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g. Acme Studio LLC"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            value={sender.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="billing@yourdomain.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={sender.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-medium text-slate-700 mb-1">Street Address</label>
          <input
            type="text"
            value={sender.addressLine1}
            onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
            placeholder="123 Innovation Blvd, Suite 400"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">City</label>
          <input
            type="text"
            value={sender.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="San Francisco"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium text-slate-700 mb-1">State / Prov</label>
            <input
              type="text"
              value={sender.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              placeholder="CA"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Postal Code</label>
            <input
              type="text"
              value={sender.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder="94107"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Country</label>
          <input
            type="text"
            value={sender.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            placeholder="United States"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">Tax ID / Business Reg No.</label>
          <input
            type="text"
            value={sender.taxId || ''}
            onChange={(e) => handleFieldChange('taxId', e.target.value)}
            placeholder="e.g. VAT / EIN / GST number"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
