import { Button, Group, Modal } from "@mantine/core";

interface Props {
  opened: boolean;
  onCancel(): void;
  onConfirm(): void;
}

export const ThreadDeleteModal = (props: Props) => {
  return (
    <Modal
      opened={props.opened}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      onClose={close}
    >
      Do you want to delete this thread?
      <Group position="right" mt={12}>
        <Button
          variant="outline"
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
          onClick={props.onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          styles={(theme) => ({
            root: {
              borderColor: theme.colors["6"],
              backgroundColor: theme.colors["6"],
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: theme.colors["7"],
              },
              "&:active": {
                backgroundColor: theme.colors["7"],
              },
            },
          })}
          onClick={props.onConfirm}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
};
