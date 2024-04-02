import { Table } from "@mantine/core";
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsSort } from "@tabler/icons-react";
import ChatHistoryTableRow from "~/components/features/chat-history/ChatHistoryTableRow";
import { ChatHistory } from "~/interfaces/chat-history";

interface Props {
  /** ソートキー */
  sortKey: null | string;
  /** ソート方向 */
  sortDirection: null | "ASC" | "DESC";
  /** 表示対象会話履歴一覧 */
  chatHistories: ChatHistory[];
  /** ソートイベント */
  requestSort: (key: string) => void;
}

/**
 * 会話履歴一覧テーブル
 *
 * @param sortKey ソートキー
 * @param sortDirection ソート方向
 * @param chatHistories 表示対象会話履歴一覧
 * @param requestSort ソートイベント
 */
export default function ChatHistoryTable(props: Props) {
  /** ソート方向の表示 */
  const showSortIcon = (key: string) => {
    return props.sortKey === key ? (
      props.sortDirection === "ASC" ? (
        <IconArrowNarrowUp size={18} style={{ verticalAlign: "bottom", marginLeft: "15px" }} />
      ) : (
        <IconArrowNarrowDown size={18} style={{ verticalAlign: "bottom", marginLeft: "15px" }} />
      )
    ) : (
      <IconArrowsSort size={18} style={{ verticalAlign: "bottom", marginLeft: "15px", color: "darkgray" }} />
    );
  };

  return (
    <Table style={{ tableLayout: "fixed", width: "100%" }}>
      <colgroup>
        <col
          span={2}
          style={{
            width: "8%",
          }}
        />
        <col
          span={1}
          style={{
            width: "10%",
          }}
        />
        <col
          span={2}
          style={{
            width: "20%",
          }}
        />
        <col
          span={1}
          style={{
            width: "10%",
          }}
        />
        <col
          span={2}
          style={{
            width: "12%",
          }}
        />
      </colgroup>

      <thead>
        <tr>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            User ID
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            Thread ID
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            Target Docs
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            User message
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
            }}
          >
            AI Response
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              cursor: "pointer",
            }}
            onClick={() => props.requestSort("posted_at")}
          >
            Timestamp {showSortIcon("posted_at")}
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              cursor: "pointer",
            }}
            onClick={() => props.requestSort("feedback_status")}
          >
            Feedback Status {showSortIcon("feedback_status")}
          </th>
          <th
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              cursor: "pointer",
            }}
            onClick={() => props.requestSort("feedback_comment")}
          >
            Feedback Comment {showSortIcon("feedback_comment")}
          </th>
        </tr>
      </thead>

      <tbody>
        {props.chatHistories.map((chatHistory) => (
          <ChatHistoryTableRow key={chatHistory.interactionId} chatHistory={chatHistory} />
        ))}
      </tbody>
    </Table>
  );
}
