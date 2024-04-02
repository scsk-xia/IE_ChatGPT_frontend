import { Modal } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import constants from "~/constants";

interface Props {
  opened: boolean;
  onClose(): void;
  errorId: string;
}

function convertErrorMessage(errorId?: string) {
  const errorMessagesDict = constants.ERROR_MESSAGES;
  if (errorId && errorId in errorMessagesDict) {
    return errorMessagesDict[errorId];
  } else {
    return constants.DEFAULT_ERROR_MESSAGE;
  }
}

export const ErrorModal = (props: Props) => {
  return (
    <Modal
      opened={props.opened}
      onClose={() => props.onClose()}
      title={
        <>
          <IconAlertTriangle style={{ marginRight: "10px", verticalAlign: "bottom" }} />
          Error
        </>
      }
      closeOnClickOutside={false}
      closeOnEscape={false}
      styles={{
        title: {
          color: "#f44336",
          fontSize: 24,
          fontWeight: "bold",
        },
        content: {
          whiteSpace: "pre-line",
        },
      }}
      size="lg"
      centered
    >
      {convertErrorMessage(props.errorId)}
    </Modal>
  );
};
