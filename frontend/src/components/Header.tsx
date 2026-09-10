import { useAuth0 } from '@auth0/auth0-react'
import { ChevronDown, LogIn, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import { ANALYSE_ROUTE, HOME_ROUTE } from '../constants/route'
import { SUPPORTED_LANGUAGES } from '../constants/language'

export const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { t, i18n } = useTranslation()

  return (
    <header
      className="flex items-center gap-3.5 border-b py-7"
      style={{ borderColor: 'var(--line)' }}
    >
      <Link
        to={HOME_ROUTE}
        aria-label={t('header.goHome')}
        className="grid size-10 place-items-center bg-[var(--navy)] font-mono text-[13px] font-semibold text-[var(--cream-light)] no-underline"
      >
        EC
      </Link>
      <div>
        <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-[var(--muted)]">
          {t('common.brandTagline')}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-[var(--navy)]">
        <Select
          value={i18n.resolvedLanguage}
          onChange={(language) => void i18n.changeLanguage(language)}
          variant="borderless"
          size="small"
          suffixIcon={<ChevronDown size={12} />}
          popupMatchSelectWidth={false}
          className="!font-mono !text-[11px] !text-[var(--blue)]"
          options={SUPPORTED_LANGUAGES.map(({ key, name }) => ({ value: key, label: name }))}
        />
        {isAuthenticated ? (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--blue)]"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut size={14} />
            {t('header.logOut')}
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--blue)]"
            onClick={() =>
              loginWithRedirect({ appState: { returnTo: ANALYSE_ROUTE } })
            }
          >
            <LogIn size={14} />
            {t('header.logIn')}
          </button>
        )}
      </div>
    </header>
  )
}