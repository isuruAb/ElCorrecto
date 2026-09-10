import { ArrowRight } from 'lucide-react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { ANALYSE_ROUTE } from '../constants/route'

const line = 'rgba(23, 43, 58, .16)'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_4%,#c9dce7_0,transparent_24%),linear-gradient(135deg,#f7f3ec_0%,#f4efe7_58%,#ebe5dc_100%)] px-[clamp(22px,6vw,92px)] text-[#253541]">
      <Header />
      <section className="max-w-[760px] pb-[90px] pt-[clamp(80px,14vw,170px)]">
        <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
          EL CORRECTO / TALENT INTELLIGENCE
        </p>
        <h2 className="m-[13px_0_18px] max-w-[700px] font-serif text-[clamp(46px,8vw,92px)] font-semibold leading-[.95] tracking-[-1px] text-[#172b3a]">
          Make the next move
          <br />
          <em className="text-[#1f5b83]">clear.</em>
        </h2>
        <p className="max-w-[500px] text-base leading-[1.65] text-[#756e68]">
          Compare your resume with the role you want and see the strongest signal, the gaps, and
          the next move to make.
        </p>
        <Button
          className="!mt-8 !h-auto !rounded-none !bg-[#1f5b83] !px-[18px] !py-[15px] !font-mono !text-[13px] !font-semibold !text-white !shadow-none"
          type="primary"
          onClick={() => navigate(ANALYSE_ROUTE)}
          icon={<ArrowRight size={18} />}
        >
          Open matcher
        </Button>
      </section>
      <footer
        className="flex justify-between border-t py-5 pb-7 font-mono text-[10px] tracking-[1px] text-[#756e68]"
        style={{ borderColor: line }}
      >
        <span>EL CORRECTO</span>
        <span>RESUME MATCH LAB</span>
      </footer>
    </main>
  )
}

export default LandingPage
