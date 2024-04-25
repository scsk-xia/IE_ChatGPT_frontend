import { useMemo, useRef } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { ActionIcon, Flex, Footer, Image, Textarea, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import camelcaseKeys from "camelcase-keys";
import SendIcon from "public/send.svg";
import { ulid } from "ulid";
import constants from "~/constants";
import useAuthAxios from "~/hooks/useAuthAxios";
import { Message } from "~/interfaces/message";
import { Thread } from "~/interfaces/thread";
import { Vectorstore } from "~/interfaces/vectorstore";

interface Props {
  threads: Thread[];
  messages: Message[];
  selectedThread?: Thread;
  selectedVectorstore?: Vectorstore;
  messageInputDisabled: boolean;
  setThreads: (threads: Thread[]) => void;
  setMessages: (messages: Message[]) => void;
  setReplyingMessages: (replyingMessages: Message[]) => void;
  setMessageInputDisabled: (messageInputDisabled: boolean) => void;
  setSelectedThread: (selectedThread: Thread) => void;
  setErrorModalOpened: (errorModalOpened: boolean) => void;
  setErrorModalMessage: (errorModalMessage: string) => void;
  accounts: any;
  instance: any;
  inProgress: any;
}

function sleep(msec: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

export const FormInputFooter = (props: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const authAxios = useAuthAxios();
  const theme = useMantineTheme();

  const selectedThreadId = useMemo(() => {
    if (props.selectedThread === undefined) {
      return undefined;
    }
    return props.selectedThread.id;
  }, [props.selectedThread]);

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  const THREAD_TYPE = "prepared_docs";

  const handleSubmitMessage = async (content: string) => {
    props.setMessageInputDisabled(true);

    if (props.accounts.length > 0 && props.inProgress === InteractionStatus.None) {
      props.setMessages([...props.messages, { role: "user", id: `temp-${ulid()}`, content: content }]);
      props.setReplyingMessages([{ role: "assistant", id: `temp-${ulid()}` }]);

      if (props.selectedThread !== undefined) {
        await fetchInquireStreamSelectedThread(content, props.selectedThread);
      } else {
        const beforeTempThread = {
          id: `temp-${ulid()}`,
          title: "New chat",
          type: THREAD_TYPE,
        };
        props.setSelectedThread(beforeTempThread);
        await fetchInquireStreamNewChat(content);
      }
    }
  };

  const createHeaders = async () => {
    const accessTokenRequest = {
      scopes: [constants.AZURE_API_SCOPE],
      account: props.accounts[0], // TODO
    };

    if (!accessTokenRequest.account) {
      return;
    }

    const requestHeaders = {
      "Content-Type": "application/json",
      "X-MS-CLIENT-PRINCIPAL-ID": constants.DUMMY_USER_ID,
      "X-MS-CLIENT-PRINCIPAL-NAME": constants.DUMMY_USER_EMAIL,
      "X-MS-CLIENT-PRINCIPAL": constants.DUMMY_USER_DETAIL_BASE64,
    };

    const tokenResponse = await props.instance.acquireTokenSilent(accessTokenRequest);
    const token = tokenResponse.accessToken;
    const headers = { ...requestHeaders, Authorization: `Bearer ${token}`, "Content-Type": "text/event-stream" };
    return headers;
  };

  // POST inquire-stream
  const fetchInquireStream = async (url: string, bodyJson: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      return await fetch(url, {
        method: "POST",
        headers: await createHeaders(),
        body: bodyJson,
        signal: controller.signal,
      });
    } catch (e: any) {
      props.setErrorModalOpened(true);
      if (e?.name === "AbortError") {
        props.setErrorModalMessage("common.timeout");
      } else {
        props.setErrorModalMessage("common.exception");
      }
      return;
    } finally {
      clearTimeout(timeout);
    }
  };

  // Thread選択時の処理
  // eslint-disable-next-line complexity
  const fetchInquireStreamSelectedThread = async (content: string, selectedThread: Thread) => {
    const response = await fetchInquireStream(
      `${constants.API_BASE_URL}/inquire-stream?thread=${selectedThread.id}`,
      JSON.stringify({
        message: content,
        query: content,
      })
    );
    if (!response?.body) return;

    const reader = response?.body?.getReader();
    if (!reader) {
      return;
    }
    const decoder = new TextDecoder();
    let tempContent = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const response = decoder.decode(value);
      const lines = response.split("\n");
      const tokens = [];
      let hasError = false;
      for (const line of lines) {
        if (line.startsWith("event: error")) {
          hasError = true;
        } else if (line.startsWith("data")) {
          tokens.push(JSON.parse(line.split("data: ")[1]));
        }
      }

      if (hasError) {
        props.setErrorModalOpened(true);
        tokens.forEach((token) => {
          if (token.error_id) {
            props.setErrorModalMessage(token.error_id);
          }
        });
        reader.cancel();
        return;
      }

      for (const token of tokens) {
        if (token.c) {
          tempContent += token.c;
          props.setReplyingMessages([
            { role: "assistant", id: `temp-${ulid()}`, content: tempContent, isStreaming: true },
          ]);
          await sleep(5);
        }
      }
    }

    const selectedThreadIndex = props.threads.findIndex((thread) => thread.id === props.selectedThread?.id);
    const afterTempThreads = props.threads;
    afterTempThreads.splice(selectedThreadIndex, 1);
    afterTempThreads.unshift(selectedThread);
    props.setThreads(afterTempThreads);

    props.setMessageInputDisabled(false);
    form.setValues({ message: "" });

    const messagesResponse = await authAxios.get(`/messages?thread=${selectedThreadId}`);
    if (response?.status !== 200) {
      props.setErrorModalOpened(true);
      props.setErrorModalMessage(messagesResponse?.data?.detail?.error_id);
    } else {
      props.setMessages(camelcaseKeys(messagesResponse?.data, { deep: true }));
      props.setReplyingMessages([]);
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  };

  // Thread未選択時の処理
  // eslint-disable-next-line complexity
  const fetchInquireStreamNewChat = async (content: string) => {
    const response = await fetchInquireStream(
      `${constants.API_BASE_URL}/inquire-stream?vectorstore=${props.selectedVectorstore?.id}`,
      JSON.stringify({
        message: content,
        query: content,
      })
    );
    if (!response?.body) return;

    const reader = response?.body?.getReader();
    if (!reader || !response?.ok) {
      props.setErrorModalOpened(true);
      props.setErrorModalMessage("common.exception");
      return;
    }

    const decoder = new TextDecoder();
    let tempContent = "";
    let newThreadId = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const response = decoder.decode(value);
      const lines = response.split("\n");
      const tokens = [];
      let hasError = false;
      for (const line of lines) {
        if (line.startsWith("event: error")) {
          hasError = true;
        } else if (line.startsWith("data")) {
          tokens.push(JSON.parse(line.split("data: ")[1]));
        }
      }

      if (hasError) {
        props.setErrorModalOpened(true);
        tokens.forEach((token) => {
          if (token.error_id) {
            props.setErrorModalMessage(token.error_id);
          }
        });
        reader.cancel();
        return;
      }

      for (const token of tokens) {
        if (token.c) {
          tempContent += token.c;
          props.setReplyingMessages([
            { role: "assistant", id: `temp-${ulid()}`, content: tempContent, isStreaming: true },
          ]);
          await sleep(5);
        } else {
          newThreadId = token.thread_id;
        }
      }
    }

    const afterTempThread = {
      id: newThreadId,
      title: "New chat",
      type: THREAD_TYPE,
      vectorstoreId: props.selectedVectorstore?.id,
    };
    props.setThreads([afterTempThread, ...props.threads]);
    props.setSelectedThread(afterTempThread);

    props.setMessageInputDisabled(false);
    form.setValues({ message: "" });

    const messagesResponse = await authAxios.get(`/messages?thread=${newThreadId}`);
    if (messagesResponse?.status !== 200) {
      props.setErrorModalOpened(true);
      props.setErrorModalMessage(messagesResponse?.data?.detail?.error_id);
    } else {
      props.setMessages(camelcaseKeys(messagesResponse?.data, { deep: true }));
      props.setReplyingMessages([]);
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  };

  return (
    <>
      <Footer mih={100} height="unset">
        <form onSubmit={form.onSubmit((values) => handleSubmitMessage(values.message))}>
          <Flex justify="center">
            <Textarea
              ref={textAreaRef}
              autosize={!props.messageInputDisabled}
              minRows={1}
              maxRows={10}
              p={20}
              maw={750}
              sx={{ flexGrow: 1 }}
              placeholder="Send your question"
              rightSection={
                <ActionIcon
                  type="submit"
                  ref={submitButtonRef}
                  disabled={props.messageInputDisabled || form.values.message.length === 0}
                >
                  {props.messageInputDisabled || form.values.message.length === 0 ? (
                    <Image src="/send_disabled.svg" alt="Send" width={24} height={24} />
                  ) : (
                    <SendIcon width={24} height={24} style={{ color: theme.colors["0"] }} />
                  )}
                </ActionIcon>
              }
              {...form.getInputProps("message")}
              onKeyDown={(e) => {
                // if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                if (e.key === "Enter" && !e.shiftKey) {
                  submitButtonRef.current?.click();
                }
              }}
              disabled={props.messageInputDisabled}
              styles={(theme) => ({
                input: {
                  padding: "20px 64px 20px 24px !important",
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
                rightSection: {
                  padding: "0 36px",
                  button: {
                    border: "none",
                    "&:disabled, &[data-disabled]": {
                      backgroundColor: "transparent",
                    },
                  },
                },
              })}
            />
          </Flex>
        </form>
      </Footer>
    </>
  );
};
