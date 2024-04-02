import { useEffect } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import axios from "axios";
import constants from "~/constants";

const customAxios = axios.create({
  baseURL: constants.API_BASE_URL,
  timeout: 5000,
  headers: constants.AZURE_API_SCOPE
    ? { "Content-Type": "application/json" }
    : {
        "Content-Type": "application/json",
        "X-MS-CLIENT-PRINCIPAL-ID": constants.DUMMY_USER_ID,
        "X-MS-CLIENT-PRINCIPAL-NAME": constants.DUMMY_USER_EMAIL,
        "X-MS-CLIENT-PRINCIPAL": constants.DUMMY_USER_DETAIL_BASE64,
      },
});

const useAuthAxios = () => {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const accessTokenRequest = {
      scopes: [constants.AZURE_API_SCOPE],
      account: accounts[0], // TODO
    };

    if (!accessTokenRequest.account) {
      return;
    }

    customAxios.interceptors.request.use(
      async (config) => {
        const response = await instance.acquireTokenSilent(accessTokenRequest);
        const token = response.accessToken;
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
          await instance.acquireTokenRedirect(accessTokenRequest);
          return;
        }
        return Promise.reject(error);
      }
    );

    customAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.code === "ECONNABORTED") {
          return customAxios.request(error.config);
        } else {
          return error.response;
        }
      }
    );
  }, [accounts, instance]);

  return customAxios;
};

export default useAuthAxios;
