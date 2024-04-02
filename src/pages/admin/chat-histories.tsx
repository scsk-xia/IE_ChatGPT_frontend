import { useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Loader,
  Pagination,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { IconArrowBarToDown, IconSearch, IconX } from "@tabler/icons-react";
import ChatHistoryTable from "~/components/features/chat-history/ChatHistoryTable";
import { AdminLayout } from "~/components/features/layout/AdminLayout";
import constants from "~/constants";
import { useUser } from "~/context/UserContext";
import useAuthAxios from "~/hooks/useAuthAxios";
import { ChatHistory } from "~/interfaces/chat-history";
import { Vectorstore } from "~/interfaces/vectorstore";

/** サーバーから取得した加工前の会話履歴 */
type tmpChatHistory = {
  /** ID */
  id: string;
  /** ユーザーID */
  user_id: string;
  /** スレッドID */
  thread_id: string;
  /** ユーザー・AIのどちらの投稿か */
  role: "user" | "assistant";
  /** 会話履歴ID */
  interaction_id: string;
  /** ベクトルストアID */
  vectorstore_id: string;
  /** 会話内容 */
  content: string;
  /** 投稿日時 */
  posted_at: string;
  /** レイテンシ */
  latency?: number;
  /** トークン数 */
  tokens_num: number;
  /** フィードバック結果 */
  feedback_status?: string;
  /** フィードバックコメント */
  feedback_comment?: string;
};

/** ソート設定 */
type SortConfig = {
  /** ソートキー */
  key: null | string;
  /** ソート方向 */
  direction: null | "ASC" | "DESC";
};

/**
 * 会話履歴一覧画面
 */
export default function ChatHistoryList() {
  const [errorModalOpened, setErrorModalOpened] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");
  const handleErrorModalClose = () => {
    setErrorModalOpened(false);
    setErrorModalMessage("");
  };
  const authAxios = useAuthAxios();
  /** ユーザー情報 */
  const user = useUser();
  /** ベクトルストア一覧 */
  const [vectorstoreList, setVectorstoreList] = useState<Vectorstore[]>([]);
  /** ベクトルストア名をキーとするベクトルストアの辞書 */
  const [vectorstoreDict, setVectorstoreDict] = useState<{ [id: string]: Vectorstore }>({});
  /** 会話履歴読み込みフラグ */
  const [chatHistoriesLoading, setChatHistoriesLoading] = useState<boolean>(false);
  /** 会話履歴一覧 */
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  /** 会話履歴テーブルのページ数 */
  const [chatHistoryPages, setChatHistoryPages] = useState<number>(0);
  /** ソート設定 */
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  /** 検索ID（ユーザーIDもしくはスレッドID） */
  const [searchId, setSearchId] = useState("");
  /** 検索キーワード */
  const [searchKeyword, setSearchKeyword] = useState("");
  /** 検索対象ベクトルストアのID */
  const [searchVectorstoreId, setSearchVectorstoreId] = useState("");
  /** 絞り込み日時の始点 */
  const [searchStartDatetime, setSearchStartDatetime] = useState<DateValue>(new Date());
  /** 絞り込み日時の終点 */
  const [searchEndDatetime, setSearchEndDatetime] = useState<DateValue>(new Date());
  /** 表示中のページ */
  const [activePage, setPage] = useState(1);
  /** CSVエクスポート中フラグ */
  const [csvExporting, setCSVExporting] = useState<boolean>(false);

  /** CSVエクスポートボタンの無効条件 */
  const csvExportDisabled = (): boolean => {
    return chatHistoryPages === 0 || chatHistoriesLoading || csvExporting;
  };

  /**
   * 日時データのフォーマット
   */
  const formatDateTime = (date: Date) => {
    const pad = (number: number, pad: number) => number.toString().padStart(pad, "0");

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1, 2);
    const day = pad(date.getUTCDate(), 2);
    const hours = pad(date.getUTCHours(), 2);
    const minutes = pad(date.getUTCMinutes(), 2);
    const seconds = pad(date.getUTCSeconds(), 2);
    const milliseconds = pad(date.getUTCMilliseconds(), 3);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  /**
   * 会話履歴の全体数からページ数を計算する
   */
  const calculatePages = (totalRecords: number) => {
    if (totalRecords == 0) {
      return 0;
    }

    const pageSize = constants.CHAT_HISTORY_PAGE_SIZE;
    let totalPages = Math.floor(totalRecords / pageSize);
    if (totalRecords % pageSize !== 0) {
      totalPages += 1;
    }
    return totalPages;
  };

  /**
   * サーバーから取得したデータを基に会話履歴を生成する
   */
  const generateChatHistories = (vectorstores: { [id: string]: Vectorstore }, tmpChatHistories: tmpChatHistory[]) => {
    const tmpChatHistoryDict: { [interactionId: string]: { user: tmpChatHistory; assistant: tmpChatHistory } } = {};
    tmpChatHistories.forEach((data: tmpChatHistory) => {
      // interaction_idを基に、ユーザーの投稿とAIからの回答をペアにする
      if (!Object.prototype.hasOwnProperty.call(tmpChatHistoryDict, data.interaction_id)) {
        tmpChatHistoryDict[data.interaction_id] = { user: data, assistant: data };
      }
      tmpChatHistoryDict[data.interaction_id] = {
        user: data.role === "user" ? data : tmpChatHistoryDict[data.interaction_id]["user"],
        assistant: data.role === "assistant" ? data : tmpChatHistoryDict[data.interaction_id]["assistant"],
      };
    });
    const chatHistoryList: ChatHistory[] = [];
    Object.values(tmpChatHistoryDict).forEach((pairedTmpChatHistory) => {
      const chatHistory: ChatHistory = {
        interactionId: pairedTmpChatHistory.user?.interaction_id,
        userId: pairedTmpChatHistory.user?.user_id,
        threadId: pairedTmpChatHistory.user?.thread_id,
        vectorstoreTitle: pairedTmpChatHistory.user?.vectorstore_id
          ? vectorstores[pairedTmpChatHistory.user?.vectorstore_id]?.title
          : "",
        userPost: pairedTmpChatHistory.user?.content,
        aiResponse: pairedTmpChatHistory.assistant?.content,
        timestamp: new Date(`${pairedTmpChatHistory.user?.posted_at}Z`),
        latency: pairedTmpChatHistory.assistant?.latency,
        userTokensNum: pairedTmpChatHistory.user?.tokens_num,
        aiTokensNum: pairedTmpChatHistory.assistant?.tokens_num,
        feedbackStatus: pairedTmpChatHistory.assistant?.feedback_status,
        feedbackComment: pairedTmpChatHistory.assistant?.feedback_comment,
      };
      chatHistoryList.push(chatHistory);
    });
    return chatHistoryList;
  };

  /**
   * サーバから会話履歴一覧を取得する
   */
  const getChatHistories = async (
    vectorstores: { [id: string]: Vectorstore },
    startDate: DateValue,
    endDate: DateValue,
    id?: string,
    keyword?: string,
    vectorstoreId?: string,
    sortConfig?: SortConfig,
    page?: number
  ): Promise<{ chatHistoryList: ChatHistory[]; chatHistoriesLength: number } | undefined> => {
    const params = new URLSearchParams();
    const addParam = (key: string, value?: string | DateValue | null) => {
      if (value) {
        if (value instanceof Date) {
          params.append(key, formatDateTime(value));
        } else {
          params.append(key, value);
        }
      }
    };
    addParam("size", constants.CHAT_HISTORY_PAGE_SIZE.toString());
    addParam("start_date", startDate);
    addParam("end_date", endDate);
    addParam("order_key", sortConfig?.key);
    addParam("order_type", sortConfig?.direction);
    addParam("search_id", id);
    addParam("keyword", keyword);
    addParam("vectorstore_id", vectorstoreId);
    addParam("page", page?.toString());

    const response = await authAxios.get(`/admin/message_history?${params.toString()}`);
    if (response.status !== 200) {
      setErrorModalOpened(true);
      setErrorModalMessage(response.data.detail?.error_id);
    } else {
      const chatHistoryList: ChatHistory[] = generateChatHistories(
        vectorstores,
        response.data?.message_history as tmpChatHistory[]
      );

      return {
        chatHistoryList: chatHistoryList,
        chatHistoriesLength: response.data?.total_count,
      };
    }
  };

  /**
   * 絞り込み条件を基に会話履歴一覧を取得する
   */
  const refreshChatHistories = async (
    vectorstores: { [id: string]: Vectorstore },
    startDate: DateValue,
    endDate: DateValue,
    id?: string,
    keyword?: string,
    vectorstoreId?: string,
    sortConfig?: SortConfig,
    page?: number
  ) => {
    setChatHistories([]);
    setChatHistoriesLoading(true);
    setChatHistoryPages(0);

    const result = await getChatHistories(
      vectorstores,
      startDate,
      endDate,
      id,
      keyword,
      vectorstoreId,
      sortConfig,
      page
    );

    if (result) {
      setChatHistories(result.chatHistoryList);
      setChatHistoriesLoading(false);
      setChatHistoryPages(calculatePages(result.chatHistoriesLength));
    }
  };

  useEffect(() => {
    /** 絞り込みに使うベクトルストアの一覧を取得する */
    const getVectorstores = async () => {
      const response = await authAxios.get("/vectorstores");
      if (response.status !== 200) {
        setErrorModalOpened(true);
        setErrorModalMessage(response.data.detail?.error_id);
        return {};
      } else {
        const tmpVectorstoreList: Vectorstore[] = [];
        const tmpVectorstoreDict: { [id: string]: Vectorstore } = {};
        response.data?.forEach((tmpVectorstore: { [key: string]: string }) => {
          const vectorstore: Vectorstore = {
            id: tmpVectorstore?.id,
            title: tmpVectorstore?.title,
            type: tmpVectorstore?.type,
            status: tmpVectorstore?.status,
          };
          tmpVectorstoreList.push(vectorstore);
          tmpVectorstoreDict[tmpVectorstore?.id] = vectorstore;
        });
        setVectorstoreList(tmpVectorstoreList);
        setVectorstoreDict(tmpVectorstoreDict);
        return tmpVectorstoreDict;
      }
    };

    /** 初期表示用の会話履歴一覧を取得する */
    const getInitChatHistories = async () => {
      setChatHistoriesLoading(true);
      const defaultEndDatetime = new Date();
      // 7日前を指定
      const defaultStartDatetime = new Date(defaultEndDatetime.getTime() - 24 * 60 * 60 * 1000 * 7);
      setSearchStartDatetime(defaultStartDatetime);
      setSearchEndDatetime(defaultEndDatetime);

      if (user !== undefined && user?.role === "admin") {
        const tmpVectorstoreDict = await getVectorstores();

        const params = new URLSearchParams();
        params.append("size", constants.CHAT_HISTORY_PAGE_SIZE.toString());
        params.append("start_date", formatDateTime(defaultStartDatetime));
        params.append("end_date", formatDateTime(defaultEndDatetime));
        const response = await authAxios.get(`/admin/message_history?${params.toString()}`);
        if (response.status !== 200) {
          setErrorModalOpened(true);
          setErrorModalMessage(response.data.detail?.error_id);
        } else {
          const chatHistoryList: ChatHistory[] = generateChatHistories(
            tmpVectorstoreDict,
            response.data?.message_history as tmpChatHistory[]
          );
          setChatHistories(chatHistoryList);
          setChatHistoriesLoading(false);

          const chatHistoriesLength = response.data?.total_count;
          setChatHistoryPages(calculatePages(chatHistoriesLength));
        }
      }
    };

    getInitChatHistories();
  }, [user, authAxios]);

  /**
   * 指定されたキーでソートする
   */
  const requestSort = (key: string) => {
    let tmpSortConfig: SortConfig;
    let direction: "ASC" | "DESC" = "DESC";
    if (sortConfig.key === key && sortConfig.direction === "DESC") {
      if (["feedback_status", "feedback_comment"].includes(key)) {
        tmpSortConfig = {
          key: null,
          direction: null,
        };
      } else {
        direction = "ASC";
        tmpSortConfig = { key, direction };
      }
    } else {
      tmpSortConfig = { key, direction };
    }
    setSortConfig(tmpSortConfig);
    setPage(1);
    refreshChatHistories(
      vectorstoreDict,
      searchStartDatetime,
      searchEndDatetime,
      searchId,
      searchKeyword,
      searchVectorstoreId,
      tmpSortConfig
    );
  };

  /**
   * 指定された絞り込み条件で会話履歴一覧を取得する
   */
  const requestSearchChatHistory = () => {
    setPage(1);
    setSortConfig({ key: null, direction: null });
    refreshChatHistories(
      vectorstoreDict,
      searchStartDatetime,
      searchEndDatetime,
      searchId,
      searchKeyword,
      searchVectorstoreId
    );
  };

  /**
   * 指定されたページの会話履歴一覧を取得する
   */
  const handleActivePage = (page: number) => {
    setPage(page);
    refreshChatHistories(
      vectorstoreDict,
      searchStartDatetime,
      searchEndDatetime,
      searchId,
      searchKeyword,
      searchVectorstoreId,
      sortConfig,
      page
    );
  };

  /**
   * 全ページの会話履歴一覧をCSVファイルにエクスポートする
   */
  const exportToCSV = async () => {
    setCSVExporting(true);
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM付き

    // ヘッダー行の追加
    const headers = [
      "User ID",
      "Thread ID",
      "Target Docs",
      "User message",
      "AI Response",
      "Timestamp(UTC)",
      "Latency",
      "User Tokens Count",
      "AI Tokens Count",
      "Feedback Status",
      "Feedback Comment",
    ]
      .map((header) => `"${header}"`)
      .join(",");
    csvContent += headers + "\r\n";

    let exportedChatHistories = Array<ChatHistory>();
    if (chatHistoryPages > 1) {
      // ページ数が2以上の場合は、全ページ分の会話履歴を取得する
      for (let i = 1; i <= chatHistoryPages; i++) {
        const result = await getChatHistories(
          vectorstoreDict,
          searchStartDatetime,
          searchEndDatetime,
          searchId,
          searchKeyword,
          searchVectorstoreId,
          sortConfig,
          i
        );
        if (result) {
          exportedChatHistories = exportedChatHistories.concat(result.chatHistoryList);
        } else {
          // 取得に失敗した場合はエラーダイアログが表示されるので、何もせず終了する
          setCSVExporting(false);

          return;
        }
      }
    } else {
      // ページ数が1のみの場合は、表示している会話履歴を出力する
      exportedChatHistories = chatHistories;
    }

    // データ行の追加
    exportedChatHistories.forEach((chatHistory) => {
      const rowString = [
        chatHistory.userId,
        chatHistory.threadId,
        chatHistory.vectorstoreTitle,
        chatHistory.userPost,
        chatHistory.aiResponse,
        chatHistory.timestamp,
        chatHistory.latency,
        chatHistory.userTokensNum,
        chatHistory.aiTokensNum,
        chatHistory.feedbackStatus,
        chatHistory.feedbackComment,
      ]
        .map((value) => {
          if (value === undefined) {
            return "";
          }
          switch (typeof value) {
            case "string":
              // 文字列の場合: ダブルクォーテーションで囲み、エスケープ
              return `"${value.replace(/"/g, '""')}"`;
            case "number":
              return value;
            case "object": {
              return formatDateTime(value as Date);
            }
            default:
              return (value as any).toString();
          }
        })
        .join(",");
      csvContent += rowString + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${constants.CHAT_HISTORY_EXPORTED_CSV_NAME}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCSVExporting(false);
  };

  return (
    <AdminLayout
      openedErrorModal={errorModalOpened}
      onErrorModalClose={() => handleErrorModalClose()}
      errorId={errorModalMessage}
      title="Chat History"
    >
      <Box h={"80px"} mt={"10px"}>
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction={"row"} gap={"10px"}>
            <Title order={3} mt={"25px"}>
              Filtering:
            </Title>
            <TextInput
              label="User ID or Thread ID"
              w={300}
              value={searchId}
              onChange={(e) => setSearchId(e.currentTarget.value)}
              rightSection={
                searchId && (
                  <ActionIcon onClick={() => setSearchId("")}>
                    <IconX />
                  </ActionIcon>
                )
              }
              styles={(theme) => ({
                input: {
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
              })}
            />
            <TextInput
              label="Keyword"
              w={300}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.currentTarget.value)}
              rightSection={
                searchKeyword && (
                  <ActionIcon onClick={() => setSearchKeyword("")}>
                    <IconX />
                  </ActionIcon>
                )
              }
              styles={(theme) => ({
                input: {
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
              })}
            />
            <Select
              label="Vectorstore"
              data={vectorstoreList.map((vectorstore) => {
                return { value: vectorstore.id, label: vectorstore.title };
              })}
              onChange={(value: string) => setSearchVectorstoreId(value)}
              clearable
              styles={(theme) => ({
                input: {
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
              })}
            />
            <DateTimePicker
              label="Start Datetime"
              clearable
              valueFormat="YYYY/MM/DD HH:mm"
              w={175}
              value={searchStartDatetime}
              onChange={(value) => setSearchStartDatetime(value)}
              styles={(theme) => ({
                input: {
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
                day: {
                  "&[data-selected]": {
                    backgroundColor: theme.colors["0"],
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: theme.colors["3"],
                    },
                    "&:active": {
                      backgroundColor: theme.colors["3"],
                    },
                  },
                },
                timeInput: {
                  input: {
                    "&:focus, &:focus-within": {
                      borderColor: theme.colors["0"],
                    },
                  },
                },
              })}
            />
            <Title order={3} mt={"25px"}>
              ~
            </Title>
            <DateTimePicker
              label="End Datetime"
              clearable
              valueFormat="YYYY/MM/DD HH:mm"
              w={175}
              value={searchEndDatetime}
              onChange={(value) => setSearchEndDatetime(value)}
              styles={(theme) => ({
                input: {
                  "&:focus, &:focus-within": {
                    borderColor: theme.colors["0"],
                  },
                },
                day: {
                  "&[data-selected]": {
                    backgroundColor: theme.colors["0"],
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: theme.colors["3"],
                    },
                    "&:active": {
                      backgroundColor: theme.colors["3"],
                    },
                  },
                },
                timeInput: {
                  input: {
                    "&:focus, &:focus-within": {
                      borderColor: theme.colors["0"],
                    },
                  },
                },
              })}
            />
            <ActionIcon
              size="lg"
              mt={"25px"}
              disabled={chatHistoriesLoading}
              sx={(theme) => ({
                borderColor: theme.colors["0"],
                backgroundColor: "#FFFFFF",
                color: theme.colors["0"],
                "&:hover": {
                  backgroundColor: theme.colors["1"],
                },
                "&:active": {
                  backgroundColor: theme.colors["1"],
                },
              })}
              onClick={() => requestSearchChatHistory()}
            >
              <IconSearch size={18} />
            </ActionIcon>
          </Flex>
          <ActionIcon
            size="lg"
            mt={"25px"}
            disabled={csvExportDisabled()}
            sx={(theme) => ({
              borderColor: theme.colors["0"],
              backgroundColor: theme.colors["0"],
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: theme.colors["3"],
              },
              "&:active": {
                backgroundColor: theme.colors["3"],
              },
            })}
            onClick={() => exportToCSV()}
          >
            <IconArrowBarToDown size={18} />
          </ActionIcon>
        </Flex>
      </Box>

      <ScrollArea.Autosize mah={"calc(100% - 130px)"}>
        <ChatHistoryTable
          sortKey={sortConfig.key}
          sortDirection={sortConfig.direction}
          requestSort={requestSort}
          chatHistories={chatHistories}
        />
      </ScrollArea.Autosize>

      <Box h={"20px"} mt={"20px"}>
        {chatHistoriesLoading ? (
          <Center pt={40}>
            <Loader />
          </Center>
        ) : (
          <>
            {chatHistoryPages > 0 ? (
              <Flex direction={"row-reverse"}>
                <Pagination
                  total={chatHistoryPages}
                  value={activePage}
                  onChange={(page) => handleActivePage(page)}
                  styles={(theme) => ({
                    control: {
                      "&:not([data-disabled])": {
                        "&:hover, &:active": {
                          backgroundColor: theme.colors["9"],
                        },
                      },
                      "&[data-active]": {
                        backgroundColor: theme.colors["0"],
                        color: "#FFFFFF",
                        "&:not([data-disabled])": {
                          "&:hover, &:active": {
                            backgroundColor: theme.colors["3"],
                          },
                        },
                      },
                    },
                  })}
                />
              </Flex>
            ) : (
              <Center pt={40}>
                <Text size={"lg"}>No results found. Please try different search parameters.</Text>
              </Center>
            )}
          </>
        )}
      </Box>
    </AdminLayout>
  );
}
