import { useEffect, useState } from "react";
import { Button, Center, Loader, LoadingOverlay, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AdminLayout } from "~/components/features/layout/AdminLayout";
import { useUser } from "~/context/UserContext";
import useAuthAxios from "~/hooks/useAuthAxios";

/**
 * 注意書き編集画面
 */
export default function NoticeEditor() {
  const [errorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const handleErrorModalClose = () => {
    setErrorModalOpened(false);
    setErrorModalMessage("");
  };
  const authAxios = useAuthAxios();
  /** 注意書き初期読み込みフラグ */
  const [fetchNoticeLoading, setFetchNoticeLoading] = useState<boolean>(false);
  /** 注意書き更新フラグ */
  const [updateNoticeLoading, setUpdateNoticeLoading] = useState<boolean>(false);
  /** 注意書き */
  const [notice, setNotice] = useState<string>("");
  /** ユーザー情報 */
  const user = useUser();

  useEffect(() => {
    /** 注意書き初期読み込み */
    const fetchNotice = async () => {
      setFetchNoticeLoading(true);
      if (user !== undefined && user?.role === "admin") {
        const response = await authAxios.get("/notice");
        if (response.status !== 200) {
          setErrorModalOpened(true);
          setErrorModalMessage(response.data.detail?.error_id);
        } else {
          setNotice(response.data?.notice);
          setFetchNoticeLoading(false);
        }
      }
    };

    fetchNotice();
  }, [authAxios, user]);

  /** 注意書きの更新 */
  const requestUpdateNotice = async () => {
    setUpdateNoticeLoading(true);
    const response = await authAxios.put(`/admin/notice`, { notice: notice });
    if (response.status !== 200) {
      setErrorModalOpened(true);
      setErrorModalMessage(response.data.detail?.error_id);
    } else {
      setUpdateNoticeLoading(false);
      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: "Update Successful!",
        message: "Notice message has been successfully updated.",
        styles: (theme) => ({
          root: {
            "&::before": { backgroundColor: theme.colors["0"] },
          },
        }),
      });
    }
  };

  return (
    <AdminLayout
      openedErrorModal={errorModalOpened}
      onErrorModalClose={() => handleErrorModalClose()}
      errorId={errorModalMessage}
      title="Edit Notice"
    >
      {fetchNoticeLoading ? (
        <Center pt={40}>
          <Loader />
        </Center>
      ) : (
        <>
          <LoadingOverlay visible={updateNoticeLoading} />
          <Center p={20}>
            <Textarea
              label="Notice"
              withAsterisk
              value={notice}
              maw={750}
              sx={{ flexGrow: 1 }}
              minRows={20}
              styles={(theme) => ({
                input: {
                  borderColor: theme.colors["0"],
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
              })}
              onChange={(event) => setNotice(event.currentTarget.value)}
            />
          </Center>
          <Center>
            <Button
              styles={(theme) => ({
                root: {
                  width: "100px",
                  borderColor: theme.colors["0"],
                  backgroundColor: theme.colors["0"],
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: theme.colors["3"],
                  },
                },
              })}
              onClick={() => requestUpdateNotice()}
            >
              Update
            </Button>
          </Center>
        </>
      )}
    </AdminLayout>
  );
}
