import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  User, Mail, Key, CreditCard, Bell, 
  Shield, Globe, Monitor, Save, Trash2 
} from 'lucide-react';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  email: string;
  company: string | null;
  website: string | null;
  location: string | null;
  bio: string | null;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
  };
}

export const AccountSettings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfile({
          id: user.id,
          email: user.email!,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          company: profile.company,
          website: profile.website,
          location: profile.location,
          bio: profile.bio,
          theme: profile.preferences?.theme || 'dark',
          notifications: profile.preferences?.notifications || {
            email: true,
            push: true,
            updates: true
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: profile.display_name,
          company: profile.company,
          website: profile.website,
          location: profile.location,
          bio: profile.bio,
          preferences: {
            theme: profile.theme,
            notifications: profile.notifications
          }
        })
        .eq('user_id', profile.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(profile!.id);
      if (error) throw error;
      
      // Redirect to home page after account deletion
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-200">Account Settings</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="border-b border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'security'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile?.display_name || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, display_name: e.target.value } : null)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile?.bio || ''}
                  onChange={(e) => setProfile(p => p ? { ...p, bio: e.target.value } : null)}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profile?.company || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, company: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile?.website || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, website: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile?.location || ''}
                    onChange={(e) => setProfile(p => p ? { ...p, location: e.target.value } : null)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Password</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600">
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Two-Factor Authentication</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600">
                  <Shield className="w-4 h-4" />
                  Enable 2FA
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Connected Accounts</h3>
                <div className="space-y-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 w-full">
                    <Globe className="w-4 h-4" />
                    Connect GitHub Account
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 w-full">
                    <Globe className="w-4 h-4" />
                    Connect Google Account
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setProfile(p => p ? { ...p, theme: theme as 'light' | 'dark' | 'system' } : null)}
                      className={`p-4 rounded-lg border ${
                        profile?.theme === theme
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-750 hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                      <span className="block text-sm text-gray-200 capitalize">
                        {theme}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-200 mb-4">Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile?.notifications.email}
                      onChange={(e) => setProfile(p => p ? {
                        ...p,
                        notifications: { ...p.notifications, email: e.target.checked }
                      } : null)}
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-200">Email notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile?.notifications.push}
                      onChange={(e) => setProfile(p => p ? {
                        ...p,
                        notifications: { ...p.notifications, push: e.target.checked }
                      } : null)}
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-200">Push notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile?.notifications.updates}
                      onChange={(e) => setProfile(p => p ? {
                        ...p,
                        notifications: { ...p.notifications, updates: e.target.checked }
                      } : null)}
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-200">Product updates</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};