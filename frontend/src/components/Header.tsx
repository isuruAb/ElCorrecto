import { useAuth0 } from '@auth0/auth0-react'
import { LogIn, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ANALYSE_ROUTE, HOME_ROUTE } from '../constants/route'

const line = 'rgba(23, 43, 58, .16)'

export const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <header className="flex items-center gap-3.5 border-b py-7" style={{ borderColor: line }}>
      <Link
        to={HOME_ROUTE}
        aria-label="Go to home"
        className="grid size-10 place-items-center bg-[#172b3a] font-mono text-[13px] font-semibold text-[#f7f3ec] no-underline"
      >
        EC
      </Link>
      <div>
        <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
          EL CORRECTO / TALENT INTELLIGENCE
        </p>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-[#172b3a]">
        {isAuthenticated ? (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[#1f5b83]"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut size={14} />
            Log out
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[#1f5b83]"
            onClick={() =>
              loginWithRedirect({ appState: { returnTo: ANALYSE_ROUTE } })
            }
          >
            <LogIn size={14} />
            Log in
          </button>
        )}
      </div>
    </header>
  )
}