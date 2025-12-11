"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import SessionProvider from "@/components/custom/provider/sessionProvider";
import { ThemeProvider } from "@/components/custom/provider/theme-provider";
import { Toaster } from "sonner";
import { LoaderProvider } from "@/components/custom/utils/loader/glober-loader-provider";
import Loader from "@/components/custom/utils/loader/Loader";
import RouteLoadTrigger from "@/components/custom/utils/loader/RouteLoadTrigger";
import InternetStatus from "@/components/custom/utils/InternetStatus";
import { useInitUser } from "@/hooks/use-initUser";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoaderProvider>
        <RouteLoadTrigger />
        <InternetStatus />

        {/* ✔ SessionProvider सबसे ऊपर */}
        <SessionProvider>
          {/* ✔ Redux Provider अब SessionProvider के अंदर */}
          <ReduxProvider store={store}>
            {/* ✔ Hook अब दोनों providers के अंदर, safe */}
            <InitUserWrapper>{children}</InitUserWrapper>
          </ReduxProvider>
        </SessionProvider>

        <Loader />
      </LoaderProvider>

      <Toaster richColors />
    </ThemeProvider>
  );
}

export function InitUserWrapper({ children }: { children: React.ReactNode }) {
  useInitUser(); // अब यह Redux + Session दोनों context में है (SAFE)
  return <>{children}</>;
}
