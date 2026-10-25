import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { authApi } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState('request'); // 'request' | 'reset'
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setMessage('');
      const res = await authApi.forgotPassword(email);
      setMessage(res.message);

      // In local dev mode, the token is provided for demonstration convenience
      if (res.developmentResetToken) {
        setToken(res.developmentResetToken);
        setStage('reset');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setErrorMsg('Token and new password are required.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await authApi.resetPassword({ token, newPassword });
      setMessage(res.message);
      setStage('done');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <KeyRound size={24} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '6px' }}>Reset Password</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {stage === 'request'
              ? 'Enter your email to receive password reset instructions'
              : stage === 'reset'
              ? 'Set your new secure password below'
              : 'Password reset successful'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
          }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {stage === 'request' && (
          <form onSubmit={handleRequestToken}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Account Email</label>
              <input
                id="forgot-email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {stage === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="reset-token">Reset Token</label>
              <input
                id="reset-token"
                type="text"
                className="form-control"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">New Password (min 6 chars)</label>
              <input
                id="new-password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </button>
          </form>
        )}

        {stage === 'done' && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/login" className="btn-primary" style={{ width: '100%', padding: '14px' }}>
              Sign In With New Password
            </Link>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem' }}>
          <Link to="/login" style={{ color: '#94a3b8' }}>
            &larr; Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
