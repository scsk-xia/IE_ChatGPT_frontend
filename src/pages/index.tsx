/* eslint-disable complexity */

import { useCallback, useEffect, useState } from "react";
import { InteractionStatus, InteractionType } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { useDisclosure } from "@mantine/hooks";
import camelcaseKeys from "camelcase-keys";

import { FormHeader } from "~/components/features/form/FormHeader";
import { FormInputFooter } from "~/components/features/form/FormInputFooter";
import { BaseLayout } from "~/components/features/layout/BaseLayout";
import { Threads } from "~/components/features/threads/Thread";
import { ThreadDeleteModal } from "~/components/features/threads/ThreadDeleteModal";
import { ThreadEditTitleModal } from "~/components/features/threads/ThreadEditTitleModal";
import NoticeMessage from "~/components/features/view/NoticeMessage";
import { ViewMessages } from "~/components/features/view/ViewMessage";
import useAuthAxios from "~/hooks/useAuthAxios";
import { Message } from "~/interfaces/message";
import { Thread } from "~/interfaces/thread";
import { Vectorstore } from "~/interfaces/vectorstore";

export default function Home() {
  useMsalAuthentication(InteractionType.Redirect);
  const { accounts, instance, inProgress } = useMsal();
  const [opened, { open, close }] = useDisclosure(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyingMessages, setReplyingMessages] = useState<Message[]>([]);
  const [selectedVectorstore, setSelectedVectorstore] = useState<Vectorstore>();
  const [vectorstores, setVectorstores] = useState<Vectorstore[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string>("");
  const [vectorstoresLoading, setVectorstoresLoading] = useState<boolean>(false);
  const [threadsLoading, setThreadsLoading] = useState<boolean>(false);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [threadDeleteModalOpened, setThreadDeleteModalOpened] = useState<boolean>(false);
  const [errorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const [messageInputDisabled, setMessageInputDisabled] = useState<boolean>(false);
  const authAxios = useAuthAxios();

  useEffect(() => {
    const fetchThreads = async (vectorstoreId: string) => {
      const response = await authAxios.get(`/threads?vectorstore=${vectorstoreId}`);
      if (response.status !== 200) {
        setErrorModalOpened(true);
        setErrorModalMessage(response.data.detail?.error_id);
      } else {
        const tempThreads = camelcaseKeys(response.data, { deep: true });
        tempThreads.sort((a: any, b: any) => {
          const dateA = new Date(a.lastUpdatedAt);
          const dateB = new Date(b.lastUpdatedAt);
          return dateB.getTime() - dateA.getTime();
        });
        setThreads(tempThreads);
      }
      setThreadsLoading(false);
    };

    const fetchVectorstores = async () => {
      if (accounts.length > 0 && inProgress === InteractionStatus.None) {
        const response = await authAxios.get("/vectorstores");
        if (response && response.status !== 200) {  //scsk revised
          setErrorModalOpened(true);
          setErrorModalMessage(response.data.detail?.error_id);
        } else if (response && response.data && response.data.length <= 0) { // scsk revised
          setErrorModalOpened(true);
          setErrorModalMessage("vectorstore.not_found");
        } else if (response && response.data){   //scsk revised
          setVectorstoresLoading(false);
          const tempVectorstores = camelcaseKeys(response.data, { deep: true });
          setVectorstores(tempVectorstores);
          const storedVectorstoreId = localStorage.getItem("vectorstoreId");
          const storedVectorstore = tempVectorstores.find(
            (vectorstore: Vectorstore) => vectorstore.id === storedVectorstoreId
          );
          if (storedVectorstore) {
            setSelectedVectorstore(storedVectorstore);
            fetchThreads(storedVectorstore.id);
          } else {
            const tempSelectedVectorstore = tempVectorstores[0];
            setSelectedVectorstore(tempSelectedVectorstore);
            fetchThreads(tempSelectedVectorstore.id);
            localStorage.setItem("vectorstoreId", tempSelectedVectorstore.id);
          }
        }
      }
    };

    setVectorstoresLoading(true);
    setThreadsLoading(true);
    fetchVectorstores();
  }, [authAxios, accounts, inProgress]);

  useEffect(() => {
    const fetchTopMessage = async () => {
      if (accounts.length > 0 && inProgress === InteractionStatus.None) {
        const response = await authAxios.get("/notice");
        if (response && response.data && response.data.detail && response.data.detail.error_id) {
          setErrorModalOpened(true);
          setErrorModalMessage(response.data.detail.error_id);
        } else if (response && response.data.notice) {
          setNoticeMessage(response.data.notice);
        } 
      }
    };

    fetchTopMessage();
  }, [accounts, inProgress, authAxios]);

  const handleThreadDelete = async () => {
    setThreadDeleteModalOpened(false);
    setThreadsLoading(true);
    const threadId = selectedThread?.id;
    const deleteResult = await authAxios.delete(`/threads/${threadId}`);
    if (deleteResult.status !== 200) {
      setErrorModalOpened(true);
      setErrorModalMessage(deleteResult.data.detail?.error_id);
    } else {
      const afterThreads = threads.filter((thread) => {
        return thread.id !== threadId;
      });
      setThreads(afterThreads);
    }
    setSelectedThread(undefined);
    setMessages([]);
    setThreadsLoading(false);
  };

  const updateMessages = useCallback(
    async (threadId: string) => {
      const response = await authAxios.get(`/messages?thread=${threadId}`);
      if (response.status !== 200) {
        setErrorModalOpened(true);
        setErrorModalMessage(response?.data?.detail?.error_id);
      } else {
        setMessages(camelcaseKeys(response?.data, { deep: true }));
      }
    },
    [authAxios]
  );

  const handleSelectThread = useCallback(
    async (thread: Thread) => {
      if (selectedThread?.id !== thread.id) {
        setSelectedThread(thread);
        setMessagesLoading(true);
        await updateMessages(thread.id);
        setMessagesLoading(false);
      }
    },
    [selectedThread, updateMessages]
  );

  const handleErrorModalClose = async () => {
    if (["vectorstore.not_found"].includes(errorModalMessage)) {
      location.reload();
    } else {
      setErrorModalOpened(false);
      setErrorModalMessage("");
      setMessageInputDisabled(false);
      if (selectedThread === undefined || selectedThread.id.startsWith("temp-")) {
        setSelectedThread(undefined);
        setMessages([]);
      } else {
        await handleSelectThread(selectedThread);
      }
    }
  };

  // サイドメニューのベクトルストアを選択時の処理
  const handleSelectVectorestore = useCallback(
    async (vectorstoreId: string | null) => {
      if (vectorstoreId && selectedVectorstore?.id !== vectorstoreId) {
        setSelectedVectorstore(vectorstores.find((vectorstore) => vectorstore.id === vectorstoreId));
        localStorage.setItem("vectorstoreId", vectorstoreId);
        // ベクトルストア切替後、新しいチャットを開始する
        setSelectedThread(undefined);
        setMessages([]);

        // 切替後のベクトルストアのスレッド一覧を取得する
        setThreadsLoading(true);
        const response = await authAxios.get(`/threads?vectorstore=${vectorstoreId}`);
        if (response.status !== 200) {
          setErrorModalOpened(true);
          setErrorModalMessage(response.data.detail?.error_id);
        } else {
          const tempThreads = camelcaseKeys(response.data, { deep: true });
          tempThreads.sort((a: any, b: any) => {
            const dateA = new Date(a.lastUpdatedAt);
            const dateB = new Date(b.lastUpdatedAt);
            return dateB.getTime() - dateA.getTime();
          });
          setThreads(tempThreads);
        }
        setThreadsLoading(false);
      }
    },
    [authAxios, selectedVectorstore, vectorstores]
  );

  return (
    <BaseLayout
      navbarSections={
        <Threads
          open={open}
          threads={threads}
          messageInputDisabled={messageInputDisabled}
          selectedThread={selectedThread}
          threadsLoading={threadsLoading}
          vectorstoresLoading={vectorstoresLoading}
          vectorstores={vectorstores}
          selectedVectorstore={selectedVectorstore}
          setSelectedThread={setSelectedThread}
          setMessages={setMessages}
          handleSelectThread={handleSelectThread}
          setThreadDeleteModalOpened={setThreadDeleteModalOpened}
          handleSelectVectorestore={handleSelectVectorestore}
        />
      }
      headerContent={
        <FormHeader
          vectorstoresLoading={vectorstoresLoading}
          selectedThread={selectedThread}
          selectedVectorstore={selectedVectorstore}
        />
      }
      footerContent={
        <FormInputFooter
          threads={threads}
          messages={messages}
          selectedThread={selectedThread}
          selectedVectorstore={selectedVectorstore}
          messageInputDisabled={messageInputDisabled}
          setThreads={setThreads}
          setMessages={setMessages}
          setReplyingMessages={setReplyingMessages}
          setMessageInputDisabled={setMessageInputDisabled}
          setSelectedThread={setSelectedThread}
          setErrorModalOpened={setErrorModalOpened}
          setErrorModalMessage={setErrorModalMessage}
          accounts={accounts}
          instance={instance}
          inProgress={inProgress}
        />
      }
      modals={
        <>
          <ThreadEditTitleModal
            opened={opened}
            close={close}
            threads={threads}
            selectedThread={selectedThread}
            setThreads={setThreads}
            setSelectedThread={setSelectedThread}
            setErrorModalOpened={setErrorModalOpened}
            setErrorModalMessage={setErrorModalMessage}
          />
          <ThreadDeleteModal
            opened={threadDeleteModalOpened}
            onConfirm={handleThreadDelete}
            onCancel={() => setThreadDeleteModalOpened(false)}
          />
        </>
      }
      isShowAdminMenu={true}
      openedErrorModal={errorModalOpened}
      onErrorModalClose={() => handleErrorModalClose()}
      errorId={errorModalMessage}
    >
      {selectedThread ? (
        <ViewMessages
          messages={messages}
          replyingMessages={replyingMessages}
          messagesLoading={messagesLoading}
          setErrorModalOpened={setErrorModalOpened}
          setErrorModalMessage={setErrorModalMessage}
        />
      ) : (
        <NoticeMessage message={noticeMessage} />
      )}
    </BaseLayout>
  );
}
