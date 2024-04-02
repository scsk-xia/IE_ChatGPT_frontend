import { memo, useEffect, useRef } from "react";
import { Center, Loader, ScrollArea } from "@mantine/core";
import MessageList from "~/components/features/view/MessageList";
import { Message } from "~/interfaces/message";

interface Props {
  messages: Message[];
  replyingMessages: Message[];
  messagesLoading: boolean;
  setErrorModalOpened: (value: boolean) => void;
  setErrorModalMessage: (value: string) => void;
}

export const ViewMessages = memo(function ViewMessages(props: Props) {
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: "auto" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.replyingMessages]);

  return (
    <ScrollArea viewportRef={viewport} type="scroll" h="calc(100vh - 201px)">
      {props.messagesLoading ? (
        <Center pt={40}>
          <Loader />
        </Center>
      ) : (
        <>
          <MessageList
            messages={props.messages}
            setErrorModalOpened={props.setErrorModalOpened}
            setErrorModalMessage={props.setErrorModalMessage}
          />
          {/* 回答中のメッセージを表示。回答終了後にreplyingMessagesが空となるので非表示になる。 */}
          {/* TODO: MessageListの再利用は暫定。リストにする必要がない */}
          <MessageList
            messages={props.replyingMessages}
            setErrorModalOpened={props.setErrorModalOpened}
            setErrorModalMessage={props.setErrorModalMessage}
          />
        </>
      )}
    </ScrollArea>
  );
});
