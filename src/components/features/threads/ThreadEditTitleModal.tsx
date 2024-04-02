import { useState } from "react";
import { Box, Button, Group, LoadingOverlay, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import camelcaseKeys from "camelcase-keys";
import useAuthAxios from "~/hooks/useAuthAxios";
import { Thread } from "~/interfaces/thread";

interface Props {
  opened: boolean;
  close: VoidFunction;
  threads: Thread[];
  selectedThread?: Thread;
  setThreads: (threads: Thread[]) => void;
  setSelectedThread: (selectedThread: Thread) => void;
  setErrorModalOpened: (errorModalOpened: boolean) => void;
  setErrorModalMessage: (errorModalMessage: string) => void;
}

export const ThreadEditTitleModal = (props: Props) => {
  const [renameModalLoading, setRenameModalLoading] = useState<boolean>(false);
  const authAxios = useAuthAxios();
  const renameForm = useForm({
    initialValues: {
      title: "",
    },
  });

  const renameThreadTitle = async (title: string) => {
    if (props.selectedThread !== undefined && title !== "") {
      setRenameModalLoading(true);
      const response = await authAxios.put(`/threads/${props.selectedThread.id}/title`, { title: title });
      if (response?.status !== 200) {
        props.setErrorModalOpened(true);
        props.setErrorModalMessage(response?.data?.detail?.error_id);
      } else {
        const afterThread = camelcaseKeys(response?.data, { deep: true });
        const afterThreads = props.threads.map((thread) => {
          if (thread.id === afterThread.id) {
            return afterThread;
          } else {
            return thread;
          }
        });
        props.setThreads(afterThreads);
        props.setSelectedThread(afterThread);
      }
    }
    setRenameModalLoading(false);
    props.close();
    renameForm.setValues({ title: "" });
  };

  const closeRenameModal = () => {
    props.close();
    renameForm.setValues({ title: "" });
  };

  return (
    <Modal
      opened={props.opened}
      onClose={closeRenameModal}
      title="Edit thread title"
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
    >
      <LoadingOverlay visible={renameModalLoading} overlayBlur={2} />
      <form onSubmit={renameForm.onSubmit((values) => renameThreadTitle(values.title))}>
        <Box>
          <TextInput
            placeholder={props.selectedThread?.title}
            {...renameForm.getInputProps("title")}
            styles={(theme) => ({
              input: {
                "&:focus, &:focus-within": {
                  borderColor: theme.colors["0"],
                },
              },
            })}
          />
          <Group mt={12} sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="outline"
              onClick={closeRenameModal}
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors["8"],
                  backgroundColor: "#FFFFFF",
                  color: theme.colors["8"],
                  "&:hover": {
                    backgroundColor: theme.colors["9"],
                  },
                  "&:active": {
                    backgroundColor: theme.colors["9"],
                  },
                },
              })}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              type="submit"
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors["0"],
                  backgroundColor: theme.colors["0"],
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: theme.colors["3"],
                  },
                },
              })}
            >
              Update
            </Button>
          </Group>
        </Box>
      </form>
    </Modal>
  );
};
