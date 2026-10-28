import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, AlertTriangle, RefreshCw, Film, ShieldAlert } from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../utils/youtube';

const TrailerModal = ({
  trailerUrl,
  alternativeTrailerUrl,
  isOpen,
  onClose,
  title = 'Movie',
}) => {
  // Support switching between primary and alternative trailer
  const [useAlternative, setUseAlternative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  // Active URL based on user selection
  const activeUrl = useAlternative && alternativeTrailerUrl ? alternativeTrailerUrl : trailerUrl;
  const videoId = extractYouTubeVideoId(activeUrl);
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId, { autoplay: 0 }) : null;
  const externalWatchUrl = getYouTubeWatchUrl(activeUrl);

  const hasAlternative = Boolean(
    alternativeTrailerUrl &&
    extractYouTubeVideoId(alternativeTrailerUrl) &&
    alternativeTrailerUrl !== trailerUrl
  );

  // Reset state when modal opens or primary trailerUrl changes
  useEffect(() => {
    if (isOpen) {
      setUseAlternative(false);
      setIsLoading(true);
      const initialId = extractYouTubeVideoId(trailerUrl);
      setHasError(!initialId);
      setErrorCode(!initialId ? 404 : null);
      setErrorMessage(
        !initialId
          ? 'No valid trailer video source found for this title.'
          : ''
      );
      setShowTroubleshoot(false);

      // Lock background page scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isOpen, trailerUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Listen for YouTube IFrame postMessage error events
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowMessage = (event) => {
      try {
        let payload = event.data;
        if (typeof payload === 'string' && payload.startsWith('{')) {
          payload = JSON.parse(payload);
        }

        if (payload && payload.event === 'onError') {
          const code = payload.info;
          setErrorCode(code);
          setHasError(true);
          setIsLoading(false);

          if (code === 151) {
            setErrorMessage(
              'Restricted by Google Workspace or Network Policy (Error 151). Your organization or network administrator restricts embedded playback of this video. Web applications cannot bypass administrative restrictions, but you can watch it directly on YouTube.'
            );
          } else if (code === 101 || code === 150) {
            setErrorMessage(
              'The video owner or studio does not permit playback in embedded players. Please watch directly on YouTube.'
            );
          } else if (code === 100) {
            setErrorMessage(
              'The requested video was not found or is unavailable.'
            );
          } else {
            setErrorMessage(
              'The embedded YouTube player could not load this video in your browser.'
            );
          }
        }
      } catch (err) {
        // Ignore unparseable third-party messages
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const toggleTrailerSource = () => {
    setUseAlternative((prev) => !prev);
    setIsLoading(true);
    setHasError(false);
    setErrorCode(null);
    setErrorMessage('');
  };

  const handleReportRestriction = () => {
    setHasError(true);
    setErrorCode(151);
    setErrorMessage(
      'Restricted by Google Workspace or Network Policy (Error 151). Your organization or network administrator has restricted embedded YouTube playback for this video. Web applications cannot bypass administrator-enforced network filters, but you can watch the verified video directly on YouTube.'
    );
  };

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Official Trailer`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(5, 7, 12, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInModal 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          background: '#0d111a',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(139, 92, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'linear-gradient(90deg, #121826 0%, #0d111a 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c4b5fd',
                flexShrink: 0,
              }}
            >
              <Film size={18} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: useAlternative ? '#38bdf8' : '#a78bfa',
                  }}
                >
                  {useAlternative ? 'Alternative Trailer' : 'Official Trailer'}
                </span>
                {hasAlternative && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• Multiple Trailers Available</span>
                )}
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <a
              href={externalWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-icon-btn"
              title="Open video on YouTube (New Tab)"
              aria-label="Open video on YouTube"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#cbd5e1',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <ExternalLink size={14} />
              <span className="hide-on-mobile">YouTube</span>
            </a>

            <button
              onClick={onClose}
              aria-label="Close trailer modal"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Container (Strict 16:9 Aspect Ratio) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 ratio
            height: 0,
            background: '#07090e',
            overflow: 'hidden',
          }}
        >
          {/* Loading Indicator */}
          {isLoading && !hasError && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#07090e',
                zIndex: 2,
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '3px solid rgba(139, 92, 246, 0.2)',
                  borderTopColor: '#8b5cf6',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', letterSpacing: '0.03em' }}>
                Initializing cinema player...
              </span>
            </div>
          )}

          {/* Graceful Error State */}
          {hasError ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #0e121d 0%, #07090e 100%)',
                zIndex: 3,
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: errorCode === 151 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: errorCode === 151 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: errorCode === 151 ? '#f59e0b' : '#ef4444',
                  marginBottom: '16px',
                }}
              >
                {errorCode === 151 ? <ShieldAlert size={28} /> : <AlertTriangle size={28} />}
              </div>

              <h4 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '8px' }}>
                {errorCode === 151 ? 'Restricted Playback Environment (Error 151)' : 'Trailer Playback Unavailable'}
              </h4>

              <p
                style={{
                  maxWidth: '580px',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: '#94a3b8',
                  marginBottom: '22px',
                }}
              >
                {errorMessage ||
                  'This video cannot be played in an embedded player under current browser or network restrictions.'}
              </p>

              {/* Action Buttons in Error State */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a
                  href={externalWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    padding: '10px 22px',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ExternalLink size={16} /> Open on YouTube
                </a>

                {hasAlternative && (
                  <button
                    onClick={toggleTrailerSource}
                    className="btn-secondary"
                    style={{
                      padding: '10px 18px',
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <RefreshCw size={15} /> Try Alternative Trailer
                  </button>
                )}

                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>

              {errorCode === 151 && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    color: '#94a3b8',
                    maxWidth: '520px',
                  }}
                >
                  💡 <strong>Tip:</strong> If you are signed into a managed Google Workspace, school, or corporate account, opening the link directly in YouTube or in a private/incognito window bypasses embedded domain filtering.
                </div>
              )}
            </div>
          ) : (
            /* Responsive IFrame with Full Permissions and Referrer Policy */
            embedUrl && (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${title} Official Trailer`}
                onLoad={handleIframeLoad}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '12px 20px',
            background: '#0a0e17',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {hasAlternative && (
              <button
                onClick={toggleTrailerSource}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#c4b5fd',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <RefreshCw size={13} />
                {useAlternative ? 'Switch to Primary Trailer' : 'Try Another Trailer'}
              </button>
            )}

            {!hasError && (
              <button
                onClick={handleReportRestriction}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Video not playing or restricted (Error 151)?
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Press <kbd style={{ padding: '2px 5px', background: '#161d2d', borderRadius: '4px', border: '1px solid #334155', color: '#cbd5e1' }}>Esc</kbd> to exit
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TrailerModal;
