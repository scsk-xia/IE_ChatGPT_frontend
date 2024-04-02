import { AppProps } from "next/app";
import Head from "next/head";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import constants from "~/constants";
import { UserProvider } from "~/context/UserContext";
import "~/styles/globals.css";

// Configuration object constructed.
const config = {
  auth: {
    clientId: constants.AZURE_APP_CLIENT_ID,
    authority: constants.AZURE_AUTHORITY,
    knownAuthorities: constants.AZURE_KNOWN_AUTHORITY ? [constants.AZURE_KNOWN_AUTHORITY] : undefined,
  },
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);

const theme: MantineThemeOverride = {
  colors: constants.COLOR_PALETTES[constants.COLOR_THEME],
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProvider instance={publicClientApplication}>
      <Head>
        <title>{constants.APP_TITLE}</title>
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <UserProvider>
          <Notifications />
          <Component {...pageProps} />
        </UserProvider>
      </MantineProvider>
    </MsalProvider>
  );
}
