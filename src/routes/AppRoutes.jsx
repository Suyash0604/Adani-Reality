import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import AgentConsole from '../pages/AgentConsole';
import SupervisorDashboard from '../pages/SupervisorDashboard';
import QAPage from '../pages/QAPage';
import CallRecords from '../pages/CallRecords';
import SalesforceMock from '../pages/SalesforceMock';
import EscalationsPage from '../pages/EscalationsPage';
import SecurityPanel from '../pages/SecurityPanel';
import CampaignDetailInbound from '../pages/CampaignDetailInbound';
import CampaignDetailOutbound from '../pages/CampaignDetailOutbound';
import ProtectedRoute from '../components/shared/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={['agent']} />}>
        <Route path="/agent" element={<AgentConsole />} />
        <Route path="/salesforce" element={<SalesforceMock />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['agent', 'supervisor', 'admin']} />}>
        <Route path="/qa/:callId?" element={<QAPage />} />
        <Route path="/records" element={<CallRecords />} />
        <Route path="/escalations" element={<EscalationsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/campaigns/inbound/:campaignId" element={<CampaignDetailInbound />} />
        <Route path="/campaigns/outbound/:campaignId" element={<CampaignDetailOutbound />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<SecurityPanel />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
