import React from "react";
import { Button, Center, Loader, Navbar, ScrollArea, Select, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ThreadBox from "~/components/features/threads/ThreadBox";
import { Message } from "~/interfaces/message";
import { Thread } from "~/interfaces/thread";
import { Vectorstore } from "~/interfaces/vectorstore";

interface Props {
  open: VoidFunction;
  threads: Thread[];
  messageInputDisabled: boolean;
  selectedThread?: Thread;
  threadsLoading: boolean;
  vectorstoresLoading: boolean;
  vectorstores: Vectorstore[];
  selectedVectorstore?: Vectorstore;
  setSelectedThread: (selectedThread: Thread | undefined) => void;
  setMessages: (messages: Message[]) => void;
  handleSelectThread: (thread: Thread) => void;
  setThreadDeleteModalOpened: (threadDeleteModalOpened: boolean) => void;
  handleSelectVectorestore: (vectorstoreId: string | null) => void;
}

export const Threads = React.memo(function Threads(props: Props) {
  const handleStartNewThread = async () => {
    props.setSelectedThread(undefined);
    props.setMessages([]);
  };

  const renderSelectVectorestore = () => (
    <Navbar.Section p="xs">
      <Select
        sx={{ flexGrow: 1 }}
        defaultValue={props.selectedVectorstore?.id}
        data={props.vectorstores.map((vectorstore) => {
          return { value: vectorstore.id, label: vectorstore.title };
        })}
        disabled={props.messageInputDisabled}
        onChange={(value: string) => props.handleSelectVectorestore(value)}
      />
    </Navbar.Section>
  );

  return (
    <>
      {props.vectorstoresLoading ? (
        <Navbar.Section grow component={ScrollArea}>
          <Center pt={40}>
            <Loader />
          </Center>
        </Navbar.Section>
      ) : (
        <>
          {props.vectorstores.length > 1 && renderSelectVectorestore()}
          <Navbar.Section p="xs">
            <Button
              variant="outline"
              fullWidth
              leftIcon={<IconPlus size="1rem" />}
              disabled={props.messageInputDisabled}
              onClick={handleStartNewThread}
              h={"3rem"}
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors["0"],
                  color: theme.colors["0"],
                  backgroundColor: theme.colors["2"],
                  "&:hover": {
                    backgroundColor: theme.colors["0"],
                    color: "white",
                  },
                },
              })}
            >
              New chat
            </Button>
          </Navbar.Section>

          <Navbar.Section mt="xs" px="xs">
            <Text fz="sm" color="dimmed" px={12} pt={4} pb={14}>
              Threads
            </Text>
          </Navbar.Section>
          <Navbar.Section grow component={ScrollArea} px="xs">
            {props.threadsLoading ? (
              <Center pt={40}>
                <Loader />
              </Center>
            ) : (
              props.threads.map((thread) => (
                <ThreadBox
                  title={thread.title}
                  selected={thread.id === props.selectedThread?.id}
                  disabled={props.messageInputDisabled}
                  key={thread.id}
                  onClick={() => props.handleSelectThread(thread)}
                  onEdit={props.open}
                  onDelete={() => props.setThreadDeleteModalOpened(true)}
                />
              ))
            )}
          </Navbar.Section>
        </>
      )}
    </>
  );
});
