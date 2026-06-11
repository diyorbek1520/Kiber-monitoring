// React hooklari sahifa holati va navigatsiya tarixini boshqarish uchun ishlatiladi.
import { useEffect, useState } from 'react';

// Asosiy layout va sahifa komponentlari ilovaning ekranlarini yig'ish uchun ishlatiladi.
import { Layout } from './components/Layout.jsx';
import { api, getStoredToken, setStoredToken } from './api.js';
import { AuthPage } from './pages/AuthPage.jsx';
import { AuditorPage } from './pages/AuditorPage.jsx';
import { ConsultantPage } from './pages/ConsultantPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { FishingPage } from './pages/FishingPage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { StatsPage } from './pages/StatsPage.jsx';

export default function App() {
  const [page, setPage] = useState('bosh');
  const [pageHistory, setPageHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    document.documentElement.lang = 'uz';
  }, []);

  useEffect(() => {
    if (!getStoredToken()) return;

    api.get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => setStoredToken(null))
      .finally(() => setAuthLoading(false));
  }, []);

  function navigate(nextPage) {
    setPage((currentPage) => {
      if (currentPage === nextPage) return currentPage;
      setPageHistory((history) => [...history, currentPage]);
      return nextPage;
    });
  }

  function goBack() {
    setPageHistory((history) => {
      if (!history.length) return history;
      const previousPage = history[history.length - 1];
      setPage(previousPage);
      return history.slice(0, -1);
    });
  }

  function logout() {
    setStoredToken(null);
    setUser(null);
    setPage('bosh');
    setPageHistory([]);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen grid-bg px-4 py-8 text-slate-100">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
          <p className="glass rounded-lg p-5 text-cyan-100">Sessiya tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  const content = {
    bosh: <DashboardPage onOpen={navigate} />,
    auditor: <AuditorPage />,
    fishing: <FishingPage />,
    maslahatchi: <ConsultantPage />,
    tarix: <HistoryPage />,
    hisobot: <ReportsPage />,
    statistika: <StatsPage />,
    profil: <ProfilePage user={user} onUserChange={setUser} onLogout={logout} />
  }[page];

  return (
    <Layout active={page} onNavigate={navigate} onBack={goBack} canBack={pageHistory.length > 0} user={user} onLogout={logout}>
      {content}
    </Layout>
  );
}
