import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = ({ onNavigate }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    country: currentUser?.country || 'India',
    phone: currentUser?.phone || '',
    currency: currentUser?.preferredCurrency || 'INR — Indian Rupee',
    bio: currentUser?.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    setFormData((previous) => ({
      ...previous,
      fullName: currentUser.name || '',
      email: currentUser.email || '',
      country: currentUser.country || 'India',
      phone: currentUser.phone || '',
      currency: currentUser.preferredCurrency || 'INR — Indian Rupee',
      bio: currentUser.bio || '',
    }));
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    const trimmedName = formData.fullName.trim();

    if (!trimmedName) {
      setMessage('Name cannot be empty.');
      return;
    }

    updateProfile({
      name: trimmedName,
      email: formData.email,
      country: formData.country,
      phone: formData.phone,
      preferredCurrency: formData.currency,
      bio: formData.bio,
    });

    setMessage('Profile saved successfully.');
  };

  return (
    <div className="profile-settings-page">
      <button className="back-btn" onClick={() => onNavigate('dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="profile-settings-header">
        <div className="profile-settings-avatar">◔</div>
        <div>
          <h2>Profile Settings</h2>
          <p>Manage your personal and security information</p>
        </div>
      </div>

      <form className="profile-settings-grid" onSubmit={handleSaveProfile}>
        <div className="settings-panel personal-panel">
          <div className="panel-title">
            <span className="panel-icon">◌</span>
            <h2>Personal information</h2>
          </div>

          <div className="photo-upload-row">
            <div className="mini-avatar">◔</div>
            <button type="button" className="photo-button">Choose profile photo</button>
          </div>
          <p className="photo-note">JPG, PNG or WebP. Maximum 1 MB.</p>

          <div className="field-grid">
            <label className="profile-field">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Demo User"
              />
            </label>

            <label className="profile-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="demo@stockportfolio.com"
              />
            </label>

            <label className="profile-field">
              <span>Country</span>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </label>

            <label className="profile-field">
              <span>Phone number</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>

            <label className="profile-field profile-field-wide">
              <span>Preferred currency</span>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="INR — Indian Rupee">INR — Indian Rupee</option>
                <option value="USD — US Dollar">USD — US Dollar</option>
                <option value="GBP — British Pound">GBP — British Pound</option>
                <option value="EUR — Euro">EUR — Euro</option>
                <option value="JPY — Japanese Yen">JPY — Japanese Yen</option>
              </select>
            </label>
          </div>

          <label className="profile-field profile-field-wide">
            <span>Bio</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself"
              rows="5"
            />
          </label>

          <div className="profile-form-footer">
            <span className="char-count">0/3000</span>
          </div>

          {message && <p className="profile-message">{message}</p>}
          <button type="submit" className="save-profile-btn">Save Profile</button>
        </div>

        <div className="settings-panel security-panel">
          <div className="panel-title">
            <span className="panel-icon">◍</span>
            <h2>Security</h2>
          </div>

          <label className="security-field">
            <span>Current password</span>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder=""
            />
          </label>

          <label className="security-field">
            <span>New password</span>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder=""
            />
          </label>

          <label className="security-field">
            <span>Confirm new password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=""
            />
          </label>

          <button type="button" className="change-password-btn">Change Password</button>

          <div className="account-section">
            <h3>Account details</h3>
            <div className="account-detail-row">
              <span>Member since:</span>
              <strong>—</strong>
            </div>
            <div className="account-detail-row">
              <span>User ID:</span>
              <strong>{currentUser.id || 'offline-demo-user'}</strong>
            </div>
          </div>

          <div className="logout-section">
            <p>End your current session on this device.</p>
            <button type="button" className="logout-button" onClick={logout}>Logout</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
