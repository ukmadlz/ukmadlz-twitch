import HeadComponent from '../components/head.component'
import FooterComponent from '../components/footer.component'
import ChannelPointRedemption from '../components/channelPointRedemption.component'
import Chat from '../components/chat.component';
import Alerts from '../components/alerts.component'

export default function Home() {
  return (
    <div className="container">
      <HeadComponent/>
      <main>
        <Chat />
        <ChannelPointRedemption />
      </main>
      <FooterComponent/>
    </div>
  )
}
