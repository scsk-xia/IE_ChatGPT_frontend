import { useState } from "react";
import { Button, Flex, Modal, Textarea } from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";

interface Props {
  isPositive?: boolean;
  opened: boolean;
  onCancel(): void;
  onSubmit(feedbackComment?: string): void;
}

export default function FeedbackModal(props: Props) {
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  return (
    <Modal
      opened={props.opened}
      onClose={props.onCancel}
      title={
        <>
          {props.isPositive ? (
            <IconThumbUp style={{ marginRight: "10px", verticalAlign: "bottom" }} />
          ) : (
            <IconThumbDown style={{ marginRight: "10px", verticalAlign: "bottom" }} />
          )}
          Submit Feedback
        </>
      }
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      styles={{
        title: {
          fontSize: 20,
        },
      }}
      size="lg"
      overlayProps={{
        color: "#E9ECEF",
        opacity: 0.55,
        blur: 3,
      }}
      centered
    >
      <Textarea
        autosize
        placeholder="Please provide additional feedback on the answer given."
        maw={750}
        sx={{ flexGrow: 1 }}
        minRows={2}
        maxRows={5}
        onChange={(event) => setFeedbackComment(event.currentTarget.value)}
        description="* Additional comments are optional. You can submit this form without them."
        inputWrapperOrder={["input", "description", "error"]}
        styles={(theme) => ({
          input: {
            borderColor: theme.colors["0"],
            "&:focus, &:focus-within": {
              borderColor: theme.colors["0"],
            },
          },
        })}
      />
      <Flex justify="flex-end" align="flex-start" direction="row" gap="md" mt={20}>
        <Button
          variant="outline"
          onClick={() => props.onCancel()}
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
          variant="filled"
          onClick={() => props.onSubmit(feedbackComment)}
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
          Submit
        </Button>
      </Flex>
    </Modal>
  );
}
