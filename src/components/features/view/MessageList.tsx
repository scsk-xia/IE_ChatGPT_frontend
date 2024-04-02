import React from "react";
import MessageBox from "./MessageBox";
import { Box } from "@mantine/core";
import useAuthAxios from "~/hooks/useAuthAxios";
import { Message } from "~/interfaces/message";

interface Props {
  messages: Message[];
  setErrorModalOpened: (errorModalOpened: boolean) => void;
  setErrorModalMessage: (errorModalMessage: string) => void;
}

export default React.memo(function MessageList(props: Props) {
  const authAxios = useAuthAxios();

  const isPositiveFeedback = (message: any) => {
    let feedback;
    if (message?.feedbackStatus === "Good") {
      feedback = true;
    } else if (message?.feedbackStatus === "Bad") {
      feedback = false;
    }
    return feedback;
  };

  const handleSubmitFeedback = async (messageId: string, feedbackStatus: "Good" | "Bad", feedbackComment?: string) => {
    const response = await authAxios.post(`/messages/${messageId}/feedback`, {
      feedback_status: feedbackStatus,
      feedback_comment: feedbackComment ? feedbackComment : "",
    });
    if (response?.status !== 200) {
      props.setErrorModalOpened(true);
      props.setErrorModalMessage(response?.data?.detail?.error_id);
    }
  };

  return (
    <Box>
      {props.messages.map((message) => (
        <MessageBox
          role={message.role}
          content={message.content}
          key={message.id}
          id={message.id}
          isPositiveFeedback={isPositiveFeedback(message)}
          isStreaming={message?.isStreaming}
          handleSubmitFeedback={(messageId, feedbackStatus, feedbackComment) =>
            handleSubmitFeedback(messageId, feedbackStatus, feedbackComment)
          }
        />
      ))}
    </Box>
  );
});
