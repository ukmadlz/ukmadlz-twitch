import HeadComponent from '../components/head.component'
import FooterComponent from '../components/footer.component'
import ChannelPointRedemption from '../components/channelPointRedemption.component'

export default function Home() {
  return (
    <div className="container">
      <HeadComponent/>
      <main>
        <ChannelPointRedemption />
      </main>
      <FooterComponent/>
    </div>
  )
}
