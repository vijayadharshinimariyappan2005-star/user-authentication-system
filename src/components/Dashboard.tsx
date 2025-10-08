import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Mail, Calendar, Loader2, Save } from 'lucide-react';

export function Dashboard() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { error } = await updateProfile({ full_name: fullName });
      if (error) throw error;
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-slate-300">Welcome back!</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {profile?.full_name || 'User Profile'}
                </h2>
                <p className="text-blue-100 mt-1">Your account information</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    message.includes('success') ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Full Name</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg">
                      {profile?.full_name || 'Not set'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Email Address</span>
                  </div>
                </label>
                <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Member Since</span>
                  </div>
                </label>
                <p className="text-lg text-slate-900 bg-slate-50 px-4 py-3 rounded-lg">
                  {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFullName(profile?.full_name || '');
                        setMessage('');
                      }}
                      disabled={saving}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              User ID: <span className="font-mono text-slate-900">{user?.id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
