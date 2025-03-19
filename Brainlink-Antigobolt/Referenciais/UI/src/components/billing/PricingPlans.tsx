import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, CreditCard, Zap, Shield, Star } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    storage: number;
    projects: number;
    collaborators: number;
    [key: string]: any;
  };
  recommended?: boolean;
}

export const PricingPlans: React.FC = () => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  useEffect(() => {
    loadPricingTiers();
    loadUserSubscription();
  }, []);

  const loadPricingTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('account_tiers')
        .select('*')
        .order('price');

      if (error) throw error;

      setTiers(data.map(tier => ({
        ...tier,
        price: tier.price,
        features: tier.features || [],
        limits: tier.limits || {
          storage: 5,
          projects: 3,
          collaborators: 1
        }
      })));
    } catch (error) {
      console.error('Error loading pricing tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('account_tier_id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setCurrentTier(profile.account_tier_id);
      }
    } catch (error) {
      console.error('Error loading user subscription:', error);
    }
  };

  const handleSelectPlan = async (tierId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Update user's account tier
      const { error } = await supabase
        .from('user_profiles')
        .update({ account_tier_id: tierId })
        .eq('user_id', user.id);

      if (error) throw error;

      // Redirect to billing page for payment
      window.location.href = `/billing/setup?tier=${tierId}`;
    } catch (error) {
      console.error('Error selecting plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-200 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setInterval('monthly')}
              className={`${
                interval === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              } relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('yearly')}
              className={`${
                interval === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              } ml-1 relative py-2 px-6 rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((tier) => {
            const price = interval === 'yearly' 
              ? tier.price * 12 * 0.8 
              : tier.price;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl ${
                  tier.recommended
                    ? 'bg-blue-500 shadow-xl scale-105 z-10'
                    : 'bg-gray-800'
                } p-8 shadow-lg`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full text-white text-sm font-medium">
                    Recommended
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-semibold ${
                    tier.recommended ? 'text-white' : 'text-gray-200'
                  }`}>
                    {tier.name}
                  </h3>
                  {tier.name === 'Free' && <Zap className="w-5 h-5 text-blue-400" />}
                  {tier.name === 'Pro' && <Star className="w-5 h-5 text-purple-400" />}
                  {tier.name === 'Enterprise' && <Shield className="w-5 h-5 text-green-400" />}
                </div>

                <p className={`mt-4 text-sm ${
                  tier.recommended ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {tier.description}
                </p>

                <div className="mt-6">
                  <p className={`${
                    tier.recommended ? 'text-white' : 'text-gray-200'
                  }`}>
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    <span className="text-base font-medium">
                      /{interval}
                    </span>
                  </p>
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className={`w-5 h-5 ${
                        tier.recommended ? 'text-blue-200' : 'text-blue-400'
                      }`} />
                      <span className={`ml-3 text-sm ${
                        tier.recommended ? 'text-blue-100' : 'text-gray-300'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan(tier.id)}
                    disabled={currentTier === tier.id}
                    className={`w-full px-6 py-3 text-center text-sm font-medium rounded-lg ${
                      currentTier === tier.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : tier.recommended
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {currentTier === tier.id ? (
                      'Current Plan'
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Select Plan
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-200 text-center mb-8">
            Compare Plans
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">
                    Feature
                  </th>
                  {tiers.map(tier => (
                    <th key={tier.id} className="py-4 px-6 text-center text-gray-400 font-medium">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-gray-300">Storage</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="py-4 px-6 text-center text-gray-400">
                      {tier.limits.storage}GB
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-gray-300">Projects</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="py-4 px-6 text-center text-gray-400">
                      {tier.limits.projects === -1 ? 'Unlimited' : tier.limits.projects}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-gray-300">Collaborators</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="py-4 px-6 text-center text-gray-400">
                      {tier.limits.collaborators === -1 ? 'Unlimited' : tier.limits.collaborators}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-300">Support</td>
                  {tiers.map(tier => (
                    <td key={tier.id} className="py-4 px-6 text-center text-gray-400">
                      {tier.name === 'Free' && 'Community'}
                      {tier.name === 'Pro' && 'Priority Email'}
                      {tier.name === 'Enterprise' && '24/7 Dedicated'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};