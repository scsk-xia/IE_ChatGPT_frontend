/* eslint-disable complexity */
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import camelcaseKeys from "camelcase-keys";
import useAuthAxios from "~/hooks/useAuthAxios";
import { User } from "~/interfaces/user";

/** ユーザー情報 */
type UserContextType = User | null | undefined;

/** ユーザー情報のContext */
const UserContext = createContext<UserContextType>(undefined);

/** UserContextのProvider */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType>();
  const { accounts, inProgress } = useMsal();
  const authAxios = useAuthAxios();

  useEffect(() => {
    /** ユーザー情報の取得 */
    const fetchUser = async () => {
      if (accounts.length > 0 && inProgress === InteractionStatus.None) {
        const response = await authAxios.get("/users/me");
        if (response.status === 200) {
          setUser(camelcaseKeys(response.data, { deep: true }));
        } else {
          // ユーザー情報の取得に失敗
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [accounts, inProgress, authAxios]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

/** UserContextからuserを取得するカスタムフック */
export const useUser = () => useContext(UserContext);
