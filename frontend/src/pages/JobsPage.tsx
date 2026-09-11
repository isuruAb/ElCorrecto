import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'

const JobsPage = () => {
  const { t } = useTranslation()

  return (
    <Layout footerRight={t('jobs.footerRight')}>
      <section className="max-w-[760px] pb-[90px] pt-[clamp(80px,14vw,170px)]">
        <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-(--muted)">
          {t('jobs.kicker')}
        </p>
        <h2 className="m-[13px_0_18px] max-w-[700px] font-serif text-[clamp(46px,8vw,92px)] font-semibold leading-[.95] tracking-[-1px] text-(--navy)">
          {t('jobs.titleLine1')}
          <br />
          <em className="text-(--blue)">{t('jobs.titleEmphasis')}</em>
        </h2>
        <p className="max-w-[500px] text-base leading-[1.65] text-(--muted)">
          {t('jobs.description')}
        </p>
      </section>
    </Layout>
  )
}

export default JobsPage
