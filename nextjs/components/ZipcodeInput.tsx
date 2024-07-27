"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ZipcodeInput: React.FC = () => {
  const [zipcode, setZipcode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipcode) {
      router.push(`/?zipcode=${zipcode}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
      <input
        type="text"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
        placeholder="Enter Zipcode"
        className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Get Weather
      </button>
    </form>
  );
};

export default ZipcodeInput;