import { ReactNode, memo, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BaseLayout } from "./BaseLayout";
import { InteractionType } from "@azure/msal-browser";
import { useMsalAuthentication } from "@azure/msal-react";
import { Box, Center, Loader, MantineTheme, NavLink, Navbar, ScrollArea, Title } from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons-react";
import { useUser } from "~/context/UserContext";

type LayoutProps = {
  /** メイン部分に表示するコンポーネント */
  children: ReactNode;
  /** モーダルのコンポーネント */
  modals?: ReactNode;
  /** 画面タイトル */
  title: string;
  /** エラーモーダルが開いているかどうか */
  openedErrorModal: boolean;
  /** エラーモーダルを閉じたときのイベント */
  onErrorModalClose(): void;
  /** エラーモーダルに表示させるエラーのID */
  errorId: string;
};

/**
 * 管理者画面の共通レイアウト
 *
 * @param children メイン部分に表示するコンポーネント
 * @param modals モーダルのコンポーネント
 * @param title 画面タイトル
 * @param openedErrorModal エラーモーダルが開いているかどうか
 * @param onErrorModalClose エラーモーダルを閉じたときのイベント
 * @param errorId エラーモーダルに表示させるエラーのID
 */
export const AdminLayout = memo(function AdminLayout(props: LayoutProps) {
  useMsalAuthentication(InteractionType.Redirect);
  const router = useRouter();
  /** ユーザー情報 */
  const user = useUser();
  /** ユーザー情報の読み込みフラグ */
  const [isUserLoading, setUserLoading] = useState<boolean>(true);
  /** 今開いている画面かどうかのフラグ */
  const isActive = (path: string) => router.pathname.startsWith(path);

  /**
   * サイドメニューのスタイル
   */
  const navLinkStyles = (theme: MantineTheme) => {
    return {
      root: {
        color: "#F8F9FA",
        backgroundColor: theme.colors["5"],
        borderRadius: "4px",
        "&:hover, &[data-active], &[data-active]:hover": {
          backgroundColor: theme.colors["4"],
        },
      },
    };
  };

  useEffect(() => {
    if (user === undefined) {
      setUserLoading(true);
    } else {
      if (user?.role !== "admin") {
        // ユーザーが管理者権限を持っていない場合はトップ画面に強制移動
        router.replace("/");
      } else {
        setUserLoading(false);
      }
    }
  }, [user, router]);

  return (
    <BaseLayout
      navbarSections={
        <Navbar.Section grow component={ScrollArea} px="xs">
          {isUserLoading ? (
            <Center pt={40}>
              <Loader />
            </Center>
          ) : (
            <>
              <NavLink
                label="Chat"
                component={Link}
                href="/"
                icon={<IconArrowBackUp />}
                noWrap
                color="gray"
                variant="filled"
                styles={(theme) => navLinkStyles(theme)}
              />
              <NavLink
                label="Chat History"
                component={Link}
                href="/admin/chat-histories"
                noWrap
                color="gray"
                variant="filled"
                active={isActive("/admin/chat-histories")}
                styles={(theme) => navLinkStyles(theme)}
              />
              {/* <NavLink
                label="Vectorstore"
                component={Link}
                href="/admin/vectorstores"
                noWrap
                color="gray"
                variant="filled"
                active={isActive("/admin/vectorstores")}
                styles={(theme) => navLinkStyles(theme)}
              /> */}
              <NavLink
                label="Edit Notice"
                component={Link}
                href="/admin/notice-editor"
                noWrap
                color="gray"
                variant="filled"
                active={isActive("/admin/notice-editor")}
                styles={(theme) => navLinkStyles(theme)}
              />
            </>
          )}
        </Navbar.Section>
      }
      isShowAdminMenu={false}
      modals={props.modals}
      openedErrorModal={props.openedErrorModal}
      onErrorModalClose={props.onErrorModalClose}
      errorId={props.errorId}
    >
      <>
        {isUserLoading ? (
          <Center pt={40}>
            <Loader />
          </Center>
        ) : (
          <>
            <Title order={1} mb={10} px={20} pt={10}>
              {props.title}
            </Title>
            <Box mb={10} px={20} pb={10} style={{ height: "calc(100% - 75px)" }}>
              {props.children}
            </Box>
          </>
        )}
      </>
    </BaseLayout>
  );
});
