import { ArrowRight } from 'lucide-react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { HOME_ROUTE } from '../constants/route'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_4%,#c9dce7_0,transparent_24%),linear-gradient(135deg,#f7f3ec_0%,#f4efe7_58%,#ebe5dc_100%)] px-[clamp(22px,6vw,92px)] text-[#253541]">
      <Header />
      <section className="max-w-[760px] pb-[90px] pt-[clamp(80px,14vw,170px)]">
        <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
          404 / PAGE NOT FOUND
        </p>
        <h2 className="m-[13px_0_18px] max-w-[700px] font-serif text-[clamp(46px,8vw,92px)] font-semibold leading-[.95] tracking-[-1px] text-[#172b3a]">
          Not the move
          <br />
          <em className="text-[#1f5b83]">we expected.</em>
        </h2>
        <p className="max-w-[500px] text-base leading-[1.65] text-[#756e68]">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <Button
          className="!mt-8 !h-auto !rounded-none !bg-[#1f5b83] !px-[18px] !py-[15px] !font-mono !text-[13px] !font-semibold !text-white !shadow-none"
          type="primary"
          onClick={() => navigate(HOME_ROUTE)}
          icon={<ArrowRight size={18} />}
        >
          Back to home
        </Button>
      </section>
    </main>
  )
}

export default NotFoundPage
