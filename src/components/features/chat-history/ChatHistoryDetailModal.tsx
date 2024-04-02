import { useEffect, useState } from "react";
import { Anchor, Button, Center, Flex, Loader, Modal, Paper, ScrollArea, Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useAuthAxios from "~/hooks/useAuthAxios";

interface Props {
  /** 詳細モーダルを開くかどうか */
  opened: boolean;
  /** 会話履歴のID */
  interactionId: string;
  /** 詳細モーダルを閉じる時のイベント */
  onClose(): void;
}

/**
 * 会話履歴詳細モーダル
 *
 * @param opened 詳細モーダルを開くかどうか
 * @param chatHistory 表示対象の会話履歴
 * @param onClose 詳細モーダルを閉じる時のイベント
 */
export const ChatHistoryDetailModal = (props: Props) => {
  const authAxios = useAuthAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const [userMessage, setUserMessage] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [relevantDocuments, setRelevantDocuments] = useState<string>("");

  useEffect(() => {
    const fetchTargetChatHistory = async (interactionId: string) => {
      setLoading(true);
      const response = await authAxios.get(`/admin/message_history/${interactionId}`);
      if (response.status === 200) {
        response.data.forEach((history: any) => {
          if (history.role === "user") {
            setUserMessage(history.content);
          }
          if (history.role === "assistant") {
            setAiResponse(history.content);
            setRelevantDocuments(JSON.stringify(history?.relevant_documents, null, 2));
          }
        });
      }
      setLoading(false);
    };
    fetchTargetChatHistory(props.interactionId);
  }, [authAxios, props.interactionId]);

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Chat Detail"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      trapFocus={false}
      styles={{
        title: {
          fontSize: 20,
        },
      }}
      size="xl"
      overlayProps={{
        color: "#E9ECEF",
        opacity: 0.55,
        blur: 3,
      }}
      centered
    >
      {loading ? (
        <Center pt={40}>
          <Loader />
        </Center>
      ) : (
        <>
          <Text weight={500} mb="xs">
            User message
          </Text>
          <Paper withBorder shadow="sm" py="md" mb="md" h={100}>
            <ScrollArea.Autosize px="md" mah="100%">
              <Text sx={{ whiteSpace: "pre-line" }}>{userMessage}</Text>
            </ScrollArea.Autosize>
          </Paper>

          <Text weight={500} mb="xs">
            AI Response
          </Text>
          <Paper withBorder shadow="sm" py="md" mb="md" h={250}>
            <ScrollArea.Autosize px="md" mah="100%">
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
                {aiResponse}
              </ReactMarkdown>
            </ScrollArea.Autosize>
          </Paper>

          {relevantDocuments && (
            <>
              <Text weight={500} mb="xs">
                Relevant Contents
              </Text>
              <Paper withBorder shadow="sm" py="md" mb="md" h={250}>
                <ScrollArea.Autosize px="md" mah="100%">
                  <Text style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{relevantDocuments}</Text>
                </ScrollArea.Autosize>
              </Paper>
            </>
          )}
        </>
      )}

      <Flex justify="flex-end" align="flex-start" direction="row" gap="md" mt={20}>
        <Button
          variant="outline"
          onClick={() => props.onClose()}
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
          Close
        </Button>
      </Flex>
    </Modal>
  );
};
