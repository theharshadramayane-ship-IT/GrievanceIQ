import { AppProvider, useApp } from '@/store';
import { Layout } from '@/components/Layout';
import { Home } from '@/components/Home';
import { SubmitComplaint } from '@/stages/stage1-submission/SubmitComplaint';
import { NLPProcessing } from '@/stages/stage2-nlp/NLPProcessing';
import { RoutingResult } from '@/stages/stage3-routing/RoutingResult';
import { TrackComplaint } from '@/stages/stage6-resolution/TrackComplaint';
import { OfficerDashboard } from '@/stages/stage5-dashboard/OfficerDashboard';
import { Analytics } from '@/stages/stage5-dashboard/Analytics';

function Router() {
  const { currentView } = useApp();

  switch (currentView) {
    case 'home':
      return <Home />;
    case 'submit':
      return <SubmitComplaint />;
    case 'processing':
      return <NLPProcessing />;
    case 'routing_result':
      return <RoutingResult />;
    case 'track':
      return <TrackComplaint />;
    case 'dashboard':
      return <OfficerDashboard />;
    case 'analytics':
      return <Analytics />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AppProvider>
      <Layout>
        <Router />
      </Layout>
    </AppProvider>
  );
}

export default App;
