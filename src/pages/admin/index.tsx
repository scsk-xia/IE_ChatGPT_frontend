import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { Center, Loader } from "@mantine/core";
import { AdminLayout } from "~/components/features/layout/AdminLayout";
import { useUser } from "~/context/UserContext";

/**
 * 管理者画面のトップ画面
 */
const AdminIndex = () => {
  useMsalAuthentication(InteractionType.Redirect);
  const router = useRouter();
  const [errorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const handleErrorModalClose = () => {
    setErrorModalOpened(false);
    setErrorModalMessage("");
  };
  /** ユーザー情報 */
  const user = useUser();

  useEffect(() => {
    if (user !== undefined && user?.role === "admin") {
      // 管理者権限を持っていたら会話履歴画面に遷移させる
      router.replace("/admin/chat-histories");
    }
  }, [user, router]);

  return (
    <AdminLayout
      openedErrorModal={errorModalOpened}
      onErrorModalClose={() => handleErrorModalClose()}
      errorId={errorModalMessage}
      title=""
    >
      <Center pt={40}>
        <Loader />
      </Center>
    </AdminLayout>
  );
};

export default AdminIndex;
