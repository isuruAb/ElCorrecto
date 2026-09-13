import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Layout } from '../components/Layout'
import { ANALYSE_ROUTE } from '../constants/route'

const LandingPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Layout footerRight={t('landing.footerRight')}>
      <section className="max-w-[760px] pb-[90px] pt-[clamp(80px,14vw,100px)]">
        <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-(--muted)">
          {t('landing.kicker')}
        </p>
        <h2 className="m-[13px_0_18px] max-w-[700px] font-serif text-[clamp(46px,8vw,92px)] font-semibold leading-[.95] tracking-[-1px] text-(--navy)">
          {t('landing.titleLine1')}
          <br />
          <em className="text-(--blue)">{t('landing.titleEmphasis')}</em>
        </h2>
        <p className="max-w-[500px] text-base leading-[1.65] text-(--muted)">
          {t('landing.description')}
        </p>
        <Button
          className="!mt-8"
          onClick={() => navigate(ANALYSE_ROUTE)}
          icon={<ArrowRight size={18} />}
        >
          {t('landing.cta')}
        </Button>
      </section>
    </Layout>
  )
}

export default LandingPage
