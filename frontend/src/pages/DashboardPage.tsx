import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../stores/authStore';

interface UserProfileData {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const { session } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.access_token) {
        setUserProfile(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setError(null);

      try {
        const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8001';
        const response = await fetch(`${AUTH_SERVICE_URL}/api/v1/users/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch user profile');
        }

        const data: UserProfileData = await response.json();
        setUserProfile(data);
      } catch (err: unknown) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setUserProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [session]); // Re-fetch when session changes

  const handleLogout = async () => {
    setLoadingProfile(true); // Use loadingProfile for logout as well
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      // Session will be set to null by auth listener in App.tsx, triggering navigation
    }
    setLoadingProfile(false);
  };

  if (loadingProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Error: {error}</div>
        <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
      </div>
    );
  }

  if (!session) {
    // This case should be handled by App.tsx Navigate, but good to have a fallback
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">You are not logged in.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg mb-4">
        <h1 className="card-title">Welcome, {userProfile?.full_name || userProfile?.username || 'User'}!</h1>
        <p className="lead">Your role: <span className="badge bg-info text-dark">{userProfile?.role || 'Unknown'}</span></p>
        <p>User ID: {userProfile?.id}</p>
        {userProfile?.website && <p>Website: <a href={userProfile.website} target="_blank" rel="noopener noreferrer">{userProfile.website}</a></p>}
        {userProfile?.avatar_url && <img src={userProfile.avatar_url} alt="Avatar" className="img-thumbnail" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
        <hr />
        <p>This is your personalized dashboard.</p>
        <button onClick={handleLogout} className="btn btn-danger mt-3" disabled={loadingProfile}>
          {loadingProfile ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Conditional rendering based on role from fetched profile */}
      {userProfile?.role === 'Líder' && (
        <div className="card p-4 shadow-lg mt-4">
          <h3>Leader Module: Voter Management</h3>
          <p>Voter Management content goes here.</p>
        </div>
      )}

      {userProfile?.role === 'Nacional' && (
        <div className="card p-4 shadow-lg mt-4">
          <h3>National Module Content</h3>
          <p>This section is for National level users.</p>
        </div>
      )}
      {userProfile?.role === 'Regional' && (
        <div className="card p-4 shadow-lg mt-4">
          <h3>Regional Module Content</h3>
          <p>This section is for Regional level users.</p>
        </div>
      )}
      {userProfile?.role === 'Municipal' && (
        <div className="card p-4 shadow-lg mt-4">
          <h3>Municipal Module Content</h3>
          <p>This section is for Municipal level users.</p>
        </div>
      )}
      {userProfile?.role === 'Candidato' && (
        <div className="card p-4 shadow-lg mt-4">
          <h3>Candidate Module Content</h3>
          <p>This section is for Candidate users.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
