import { useState } from "react";
import { ActionIcon, Flex, Text, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { IconClipboard } from "@tabler/icons-react";
import { ChatHistoryDetailModal } from "~/components/features/chat-history/ChatHistoryDetailModal";
import { ChatHistory } from "~/interfaces/chat-history";

interface Props {
  /** 表示対象会話履歴 */
  chatHistory: ChatHistory;
}

/**
 * 会話履歴一覧テーブルの行
 *
 * @param chatHistory 表示対象会話履歴
 */
export default function ChatHistoryTableRow(props: Props) {
  const clipboard = useClipboard({ timeout: 2000 });
  /** 表示対象会話履歴 */
  const chatHistory = props.chatHistory;
  /** ユーザーIDのコピーボタンを表示させるかどうか */
  const [showUserIdCopyButton, setShowUserIdCopyButton] = useState(false);
  /** スレッドIDのコピーボタンを表示させるかどうか */
  const [showThreadIdCopyButton, setShowThreadIdCopyButton] = useState(false);
  /** 会話履歴詳細モーダルを表示させるかどうか */
  const [openedDetailModal, setOpenedDetailModal] = useState(false);

  /** 日時データのフォーマット */
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  /** クリップボードへのコピー状況の表示 */
  function showCopiedStatus() {
    return clipboard.copied ? "Copied!" : "Click to copy";
  }

  return (
    <tr key={chatHistory.interactionId}>
      {/* ユーザーID列 */}
      <td>
        <Flex
          onMouseEnter={() => setShowUserIdCopyButton(true)}
          onMouseLeave={() => setShowUserIdCopyButton(false)}
          direction="row"
          justify="space-between"
        >
          {showUserIdCopyButton ? (
            <>
              <Tooltip
                label={chatHistory.userId}
                position="top-start"
                styles={() => ({
                  tooltip: {
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                  },
                })}
              >
                <Text
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "calc(100% - 30px)",
                  }}
                >
                  {chatHistory.userId}
                </Text>
              </Tooltip>
              <Tooltip
                label={showCopiedStatus()}
                styles={() => ({
                  tooltip: {
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                  },
                })}
                withArrow
              >
                <ActionIcon onClick={() => clipboard.copy(chatHistory.userId)} size="20px">
                  <IconClipboard size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <Text
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {chatHistory.userId}
            </Text>
          )}
        </Flex>
      </td>

      {/* スレッドID列 */}
      <td>
        <Flex
          onMouseEnter={() => setShowThreadIdCopyButton(true)}
          onMouseLeave={() => setShowThreadIdCopyButton(false)}
          direction="row"
          justify="space-between"
        >
          {showThreadIdCopyButton ? (
            <>
              <Tooltip
                label={chatHistory.threadId}
                position="top-start"
                styles={() => ({
                  tooltip: {
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                  },
                })}
              >
                <Text
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "calc(100% - 30px)",
                  }}
                >
                  {chatHistory.threadId}
                </Text>
              </Tooltip>
              <Tooltip
                label={showCopiedStatus()}
                styles={() => ({
                  tooltip: {
                    backgroundColor: "white",
                    color: "black",
                    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                  },
                })}
                withArrow
              >
                <ActionIcon onClick={() => clipboard.copy(chatHistory.threadId)} size="20px">
                  <IconClipboard size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <Text
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {chatHistory.threadId}
            </Text>
          )}
        </Flex>
      </td>

      {/* ベクトルストア名列 */}
      <td>
        <Tooltip
          label={chatHistory.vectorstoreTitle}
          position="top-start"
          styles={() => ({
            tooltip: {
              backgroundColor: "white",
              color: "black",
              boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
            },
          })}
        >
          <Text
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {chatHistory.vectorstoreTitle}
          </Text>
        </Tooltip>
      </td>

      {/* ユーザー投稿内容列 */}
      <td>
        <Text
          sx={() => ({
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "100%",
            cursor: "pointer",
            color: "#000d99",
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "none",
            },
          })}
          onClick={() => setOpenedDetailModal(true)}
        >
          {chatHistory.userPost}
        </Text>
      </td>

      {/* AI回答内容列 */}
      <td>
        <Text
          sx={() => ({
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "100%",
            cursor: "pointer",
            color: "#000d99",
            textDecoration: "underline",
            "&:hover": {
              textDecoration: "none",
            },
          })}
          onClick={() => setOpenedDetailModal(true)}
        >
          {chatHistory.aiResponse}
        </Text>
      </td>

      {/* 投稿日時列 */}
      <td
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {formatDate(chatHistory.timestamp)}
      </td>

      {/* フィードバック結果列 */}
      <td
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {chatHistory?.feedbackStatus}
      </td>

      {/* フィードバックコメント列 */}
      <td>
        <Tooltip
          label={chatHistory?.feedbackComment}
          position="top-start"
          multiline
          maw={250}
          styles={() => ({
            tooltip: {
              backgroundColor: "white",
              color: "black",
              boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
            },
          })}
        >
          <Text
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {chatHistory?.feedbackComment}
          </Text>
        </Tooltip>
      </td>

      {openedDetailModal && (
        <ChatHistoryDetailModal
          opened={openedDetailModal}
          onClose={() => setOpenedDetailModal(false)}
          interactionId={chatHistory.interactionId}
        />
      )}
    </tr>
  );
}
