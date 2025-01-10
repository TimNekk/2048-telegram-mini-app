import { useLaunchParams, miniApp, useSignal, viewport } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import { Box } from "@mui/material";

import { routes } from "@/navigation/routes.tsx";
import BottomNavBar from "@/components/BottomNavBar";
import GameProvider from "@/components/Game/context/game-context";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    if (viewport.expand.isAvailable()) {
        viewport.expand();
    }

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            <HashRouter>
                <GameProvider>
                    <Box sx={{ pb: 7 }}>
                        <Routes>
                            {routes.map((route) => (
                                <Route key={route.path} {...route} />
                            ))}
                            <Route path="/" element={<Navigate to="/game" />} />
                            <Route path="*" element={<Navigate to="/game" />} />
                        </Routes>
                    </Box>
                </GameProvider>
                <BottomNavBar />
            </HashRouter>
        </AppRoot>
    );
}
