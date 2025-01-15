import { useLaunchParams, miniApp, useSignal, viewport } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";

import { routes } from "@/navigation/routes.tsx";
import GameProvider from "@/components/Game/context/game-context";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);

    viewport.expand.ifAvailable();

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            <HashRouter>
                <GameProvider>
                    <Routes>
                        {routes.map((route) => (
                            <Route key={route.path} {...route} />
                        ))}
                        <Route path="/" element={<Navigate to="/game" />} />
                        <Route path="*" element={<Navigate to="/game" />} />
                    </Routes>
                </GameProvider>
            </HashRouter>
        </AppRoot>
    );
}
