'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { register } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Secret owner code - change this to anything you want
const OWNER_SECRET_CODE = 'OWNER@1234';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('customer');
  const [ownerCode, setOwnerCode] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check owner secret code
    if (role === 'owner' && ownerCode !== OWNER_SECRET_CODE) {
      setError('Invalid owner access code. Please contact the administrator.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-7">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 mb-3">
              <Store size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join WholeSale Pro today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="full_name"
              name="full_name"
              label="Full Name"
              placeholder="John Doe"
              required
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="+91 9000000000"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              minLength={6}
              required
              autoComplete="new-password"
            />

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                name="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setOwnerCode('');
                }}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="owner">Shop Owner</option>
              </select>
            </div>

            {/* Owner Secret Code - only show if owner selected */}
            {role === 'owner' && (
              <div>
                <Input
                  id="owner_code"
                  label="Owner Access Code"
                  placeholder="Enter secret code"
                  type="password"
                  value={ownerCode}
                  onChange={(e) => setOwnerCode(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Contact administrator for the owner access code.
                </p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}