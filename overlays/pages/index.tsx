import HeadComponent from '../components/head.component'
import FooterComponent from '../components/footer.component'
import Chat from '../components/chat.component';
import EventsComponent from '../components/events.component';

export default function Home() {
  return (
    <div className="container">
      <HeadComponent/>
      <main>
        <Chat />
        <EventsComponent />
      </main>
      <FooterComponent/>
    </div>
  )
}
