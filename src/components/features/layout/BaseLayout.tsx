import { ReactNode, memo } from "react";
import Link from "next/link";
import { AuthenticatedTemplate } from "@azure/msal-react";
import {
  ActionIcon,
  AppShell,
  Box,
  Center,
  Flex,
  Footer,
  Header,
  Image,
  Menu,
  NavLink,
  Navbar,
  ScrollArea,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { ErrorModal } from "~/components/features/modal/ErrorModal";
import { useUser } from "~/context/UserContext";

type LayoutProps = {
  /** メイン部分に表示するコンポーネント */
  children: ReactNode;
  /** サイドメニュー部分に表示させるコンポーネント */
  navbarSections?: ReactNode;
  /** モーダルのコンポーネント */
  modals?: ReactNode;
  /** メイン部分のヘッダーに表示させるコンポーネント */
  headerContent?: ReactNode;
  /** メイン部分のフッターに表示させるコンポーネント */
  footerContent?: ReactNode;
  /** 管理者メニューのリンクを表示させるかどうか */
  isShowAdminMenu: boolean;
  /** エラーモーダルが開いているかどうか */
  openedErrorModal: boolean;
  /** エラーモーダルを閉じたときのイベント */
  onErrorModalClose(): void;
  /** エラーモーダルに表示させるエラーのID */
  errorId: string;
};

/**
 * アプリ全体の共通レイアウト
 *
 * @param children メイン部分に表示するコンポーネント
 * @param navbarSections サイドメニュー部分に表示させるコンポーネント
 * @param modals モーダルのコンポーネント
 * @param headerContent メイン部分のヘッダーに表示させるコンポーネント
 * @param footerContent メイン部分のフッターに表示させるコンポーネント
 * @param isShowAdminMenu 管理者メニューのリンクを表示させるかどうか
 * @param openedErrorModal エラーモーダルが開いているかどうか
 * @param onErrorModalClose エラーモーダルを閉じたときのイベント
 * @param errorId エラーモーダルに表示させるエラーのID
 */
export const BaseLayout = memo(function BaseLayout(props: LayoutProps) {
  /** ユーザー情報 */
  const user = useUser();
  /** 管理者メニューの表示フラグ */
  const isShowAdminMenu = user?.role === "admin" && props.isShowAdminMenu;

  return (
    <AuthenticatedTemplate>
      <Box
        pt={11.5}
        pb={11.5}
        sx={() => ({
          borderBottom: "1px solid #DEE2E6",
        })}
      >
        {/* 右上のロゴ */}
        {/* <Image
          src="/logo_app_main.png"
          alt="logo"
          height={26}
          width={"auto !important"}
          top={16}
          left={24}
          pos={"absolute"}
          fit="contain"
        /> */}
        <Center>
          <Image src="/logo_normnavi_poweredbyinsightedge.svg" alt="ServiceLogo" width={480} height={32} />
        </Center>
      </Box>
      <AppShell
        layout="alt"
        padding="md"
        navbar={
          <Navbar
            width={{ base: 300 }}
            top={56}
            styles={(theme) => ({ root: { backgroundColor: theme.colors["5"] } })}
            p="unset"
            pt="xs"
          >
            {props.navbarSections}
            <Navbar.Section sx={{ borderTop: "1px solid #DEE2E6", bottom: 0 }}>
              {isShowAdminMenu ? (
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Center
                    h={60}
                    sx={{
                      color: "white",
                      padding: "0 10px",
                      width: "calc(100% - 40px)",
                    }}
                  >
                    <div
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                      }}
                    >
                      {user?.name}
                    </div>
                  </Center>
                  <Menu shadow="md" width={150} position="top-start">
                    <Menu.Target>
                      <ActionIcon
                        size="lg"
                        mr={10}
                        sx={(theme) => ({
                          color: "white",
                          backgroundColor: theme.colors["5"],
                          "&:hover": { backgroundColor: theme.colors["4"] },
                        })}
                      >
                        <IconDots size={18} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <NavLink
                        label="Admin Menu"
                        component={Link}
                        href="/admin/chat-histories"
                        noWrap
                        styles={(theme) => ({
                          root: {
                            "&:hover": {
                              backgroundColor: theme.colors["9"],
                            },
                            "&:active": {
                              backgroundColor: theme.colors["9"],
                            },
                          },
                        })}
                      />
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
              ) : (
                <Center
                  h={60}
                  sx={{
                    color: "white",
                    padding: "0 10px",
                  }}
                >
                  <div
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {user?.name}
                  </div>
                </Center>
              )}
            </Navbar.Section>
          </Navbar>
        }
        header={
          props.headerContent ? (
            <Header height={45} top={56} withBorder={false}>
              {props.headerContent}
            </Header>
          ) : undefined
        }
        footer={
          props.footerContent ? (
            <Footer mih={100} height="unset" zIndex={1}>
              {props.footerContent}
            </Footer>
          ) : undefined
        }
        styles={() => ({
          main: {
            paddingRight: 0,
            paddingTop: props.headerContent ? 45 : 0,
            paddingLeft: 300,
            paddingBottom: props.footerContent ? 100 : 0,
            height: "calc(100vh - 56px)",
            minHeight: "unset",
          },
        })}
      >
        <ScrollArea h="100%">{props.children}</ScrollArea>
      </AppShell>
      {props.modals}
      <ErrorModal opened={props.openedErrorModal} onClose={() => props.onErrorModalClose()} errorId={props.errorId} />
    </AuthenticatedTemplate>
  );
});
