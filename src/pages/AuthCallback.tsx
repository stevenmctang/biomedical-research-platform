import {
    AuthenticateWithRedirectCallback,
  } from '@clerk/react'
  
  import {
    Loader2,
  } from 'lucide-react'
  
  
  export function AuthCallback() {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f4ef',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            color: '#686b63',
          }}
        >
          <Loader2
            size={26}
            className="literature-spinner"
          />
  
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            Connecting to Helix...
          </span>
  
        </div>
  
  
        <AuthenticateWithRedirectCallback />
  
      </div>
    )
  }
  