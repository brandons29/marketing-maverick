'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleCheckout = async () => {
    setLoading(true);
    
    // Get user ID for custom field sync
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth/signup';
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed—reach out to Maverick support?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-8 text-center text-black">
      <h1 className="text-6xl font-black mb-4 tracking-tighter italic uppercase">Pick Your Poison</h1>
      <p className="text-xl text-gray-500 mb-16 font-medium">Choose how you want to conquer the market.</p>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Free Tier */}
        <div className="p-10 border rounded-2xl bg-gray-50/50 backdrop-blur-sm transition-all hover:border-gray-300">
          <h2 className="text-3xl font-bold mb-2">Free</h2>
          <p className="text-5xl font-black mb-8">$0<span className="text-lg font-bold text-gray-400">/mo</span></p>
          
          <ul className="text-left mb-10 space-y-4 font-medium">
            <li className="flex items-center text-gray-600">
              <span className="text-green-500 mr-2 text-xl font-black">✓</span> 5 runs / month
            </li>
            <li className="flex items-center text-gray-600">
              <span className="text-green-500 mr-2 text-xl font-black">✓</span> Essential skill packs
            </li>
            <li className="flex items-center text-gray-400">
              <span className="text-red-400 mr-2 text-xl font-black">✕</span> Watermarked outputs
            </li>
            <li className="flex items-center text-gray-400">
              <span className="text-red-400 mr-2 text-xl font-black">✕</span> Weekly skill drops
            </li>
          </ul>
          
          <button 
            disabled 
            className="w-full bg-gray-200 text-gray-500 p-5 rounded-xl font-bold uppercase tracking-widest cursor-not-allowed"
          >
            YOU'RE ON IT
          </button>
        </div>

        {/* Pro Tier (Maverick) */}
        <div className="p-10 border-4 border-yellow-400 rounded-3xl bg-white shadow-[0_20px_50px_rgba(250,204,21,0.15)] relative scale-105 transition-all hover:scale-[1.07]">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-1.5 rounded-full font-black text-sm uppercase tracking-tighter">
            MOST POPULAR
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-black">Maverick</h2>
          <p className="text-5xl font-black mb-8 text-black">$15<span className="text-lg font-bold text-gray-400">/mo</span></p>
          
          <ul className="text-left mb-10 space-y-4 font-medium">
            <li className="flex items-center text-black">
              <span className="text-yellow-500 mr-2 text-xl font-black">✓</span> UNLIMITED runs
            </li>
            <li className="flex items-center text-black">
              <span className="text-yellow-500 mr-2 text-xl font-black">✓</span> Full Skill Library (Elite)
            </li>
            <li className="flex items-center text-black">
              <span className="text-yellow-500 mr-2 text-xl font-black">✓</span> NO watermarks
            </li>
            <li className="flex items-center text-black">
              <span className="text-yellow-500 mr-2 text-xl font-black">✓</span> Weekly "Gold" Skill Drops
            </li>
          </ul>
          
          <button 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full bg-black text-yellow-400 p-5 rounded-2xl font-black text-2xl uppercase tracking-tighter hover:bg-gray-900 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'OPENING GATES...' : 'GO PRO – $15/mo'}
          </button>
        </div>
      </div>

      <p className="mt-20 text-gray-400 text-sm font-medium italic">
        "Your OpenAI token bill? All on you—fair trade."
      </p>
    </div>
  );
}
