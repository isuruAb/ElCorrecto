import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'

const line = 'rgba(23, 43, 58, .16)'

export function Header() {
  const { isAuthenticated, logout } = useAuth0()

  return (
    <header className="flex items-center gap-3.5 border-b py-7" style={{ borderColor: line }}>
      <div className="grid size-10 place-items-center bg-[#172b3a] font-mono text-[13px] font-semibold text-[#f7f3ec]">
        EC
      </div>
      <div>
        <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
          EL CORRECTO / TALENT INTELLIGENCE
        </p>
        <h1 className="m-0 mt-0.5 text-[17px] font-semibold tracking-normal text-[#172b3a]">
          Resume match lab
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-[#172b3a]">
        <span className="size-1.5 rounded-full bg-[#4c9270] shadow-[0_0_0_4px_#dbe8dc]" /> Azure
        connected
        {isAuthenticated && (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[#1f5b83]"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut size={14} />
            Log out
          </button>
        )}
      </div>
    </header>
  )
}