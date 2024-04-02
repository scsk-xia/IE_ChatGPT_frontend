import { useState } from "react";
import { ActionIcon, Anchor, Box, Flex, Image, Loader, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FeedbackModal from "~/components/features/modal/FeedbackModal";

interface Props {
  id: string;
  role: string;
  content?: string;
  isPositiveFeedback?: boolean;
  isStreaming?: boolean;
  handleSubmitFeedback: (messageId: string, feedbackStatus: "Good" | "Bad", feedbackComment?: string) => void;
}

export default function MessageBox(props: Props) {
  const [feedback, setFeedback] = useState<boolean | undefined>(props.isPositiveFeedback);
  const [feedbackModalOpened, setFeedbackModalOpened] = useState<boolean>(false);

  const openFeedbackModal = (isPositive: boolean) => {
    setFeedbackModalOpened(true);
    setFeedback(isPositive);
  };

  const cancelFeedback = () => {
    setFeedbackModalOpened(false);
    setFeedback(undefined);
  };

  const submitFeedback = (feedbackComment?: string) => {
    const feedbackStatus = feedback ? "Good" : "Bad";
    setFeedbackModalOpened(false);
    props.handleSubmitFeedback(props.id, feedbackStatus, feedbackComment);
  };

  return (
    <Box
      sx={() => ({
        backgroundColor: props.role === "assistant" ? "#F8F9FA" : undefined,
        borderBottom: "1px solid #DEE2E6",
        minHeight: 60,
      })}
    >
      <Flex justify="center">
        {props.content ? (
          <Stack spacing={6} p={20} maw="80%" sx={{ flexGrow: 1 }}>
            {props.role === "assistant" ? (
              <Flex justify="space-between">
                <Box mr={20} mt={16} mb={16}>
                  <Image src="/icon_user_norm.svg" alt="Norm" width={30} height={30} radius="sm" />
                </Box>
                <Box className="assistant-message" mr={10} style={{ flexGrow: 1 }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: (props) => {
                        const { href, children } = props;
                        return (
                          <Anchor
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={(theme) => ({
                              color: theme.colors["0"],
                            })}
                          >
                            {children}
                          </Anchor>
                        );
                      },
                    }}
                  >
                    {props.content}
                  </ReactMarkdown>
                </Box>
                {(() => {
                  switch (feedback) {
                    case true:
                      return (
                        <Flex justify="flex-start" align="flex-start" direction="column">
                          <ThemeIcon size="sm" variant="transparent" color="dark.4">
                            <IconThumbUp />
                          </ThemeIcon>
                          <ThemeIcon size="sm" variant="light" color="gray.4">
                            <IconThumbDown />
                          </ThemeIcon>
                        </Flex>
                      );
                    case false:
                      return (
                        <Flex justify="flex-start" align="flex-start" direction="column">
                          <ThemeIcon size="sm" variant="light" color="gray.4">
                            <IconThumbUp />
                          </ThemeIcon>
                          <ThemeIcon size="sm" variant="transparent" color="dark.4">
                            <IconThumbDown />
                          </ThemeIcon>
                        </Flex>
                      );
                    default:
                      return (
                        <Flex justify="flex-start" align="flex-start" direction="column" mt={"1em"}>
                          <Tooltip label="Good">
                            <ActionIcon
                              color="gray"
                              size="sm"
                              onClick={() => openFeedbackModal(true)}
                              sx={{ visibility: props.isStreaming ? "hidden" : "visible" }}
                              disabled={props.isStreaming}
                            >
                              <IconThumbUp />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Bad">
                            <ActionIcon
                              color="gray"
                              size="sm"
                              onClick={() => openFeedbackModal(false)}
                              sx={{ visibility: props.isStreaming ? "hidden" : "visible" }}
                              disabled={props.isStreaming}
                            >
                              <IconThumbDown />
                            </ActionIcon>
                          </Tooltip>
                        </Flex>
                      );
                  }
                })()}
              </Flex>
            ) : (
              <Flex justify="start">
                <Image
                  src="/icon_user_my.svg"
                  alt="User"
                  width={30}
                  height={30}
                  style={{ marginRight: "20px" }}
                  radius="md"
                />
                <Box mr={"calc(10px + 1.375rem)"} style={{ flexGrow: 1 }}>
                  <Text sx={{ whiteSpace: "pre-line" }}>{props.content}</Text>
                </Box>
              </Flex>
            )}
          </Stack>
        ) : (
          <Loader size="xs" mt="md" />
        )}
      </Flex>
      <FeedbackModal
        opened={feedbackModalOpened}
        isPositive={feedback}
        onCancel={() => cancelFeedback()}
        onSubmit={(feedbackComment) => submitFeedback(feedbackComment)}
      />
    </Box>
  );
}
