import { useAuth0 } from '@auth0/auth0-react'
import { ChevronDown, LogIn, LogOut, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import { ANALYSE_ROUTE, HOME_ROUTE, JOBS_ROUTE } from '../constants/route'
import { SUPPORTED_LANGUAGES } from '../constants/language'
import { THEMES } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'
import { HeaderNavLink } from './HeaderNavLink'

export const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="flex items-center gap-3.5 border-b py-7"
      style={{ borderColor: 'var(--line)' }}
    >
      <Link
        to={HOME_ROUTE}
        aria-label={t('header.goHome')}
        className="grid size-10 place-items-center bg-(--brand-navy) font-mono text-[13px] font-semibold text-(--brand-cream) no-underline"
      >
        EC
      </Link>
      <div>
        <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-(--muted)">
          {t('common.brandTagline')}
        </p>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-(--navy)">
        {isAuthenticated && (
          <HeaderNavLink to={ANALYSE_ROUTE}>{t('header.analyse')}</HeaderNavLink>
        )}
        <HeaderNavLink to={JOBS_ROUTE}>{t('header.jobs')}</HeaderNavLink>
        <Select
          value={i18n.resolvedLanguage}
          onChange={(language) => void i18n.changeLanguage(language)}
          variant="borderless"
          size="small"
          suffixIcon={<ChevronDown size={12} />}
          popupMatchSelectWidth={false}
          className="!font-mono !text-[11px] text-(--blue)!"
          options={SUPPORTED_LANGUAGES.map(({ key, name }) => ({ value: key, label: name }))}
        />
        {isAuthenticated ? (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-(--blue)"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut size={14} />
            {t('header.logOut')}
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-[11px] text-(--blue)"
            onClick={() =>
              loginWithRedirect({ appState: { returnTo: ANALYSE_ROUTE } })
            }
          >
            <LogIn size={14} />
            {t('header.logIn')}
          </button>
        )}
        <button
          type="button"
          aria-label={theme === THEMES.DARK ? t('header.switchToLight') : t('header.switchToDark')}
          className="flex items-center text-(--blue)"
          onClick={toggleTheme}
        >
          {theme === THEMES.DARK ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}