import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import { Box } from '@mui/material';

import { routes } from '@/navigation/routes.tsx';
import BottomNavBar from '@/components/BottomNavBar';

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <HashRouter>
        <Box sx={{ pb: 7 }}> {/* Add padding bottom to account for navigation bar */}
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path="/" element={<Navigate to="/game"/>}/>
            <Route path="*" element={<Navigate to="/game"/>}/>
          </Routes>
        </Box>
        <BottomNavBar />
      </HashRouter>
    </AppRoot>
  );
}
