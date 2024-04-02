/**
 * 会話履歴
 */
export interface ChatHistory {
  /** 会話履歴のID */
  interactionId: string;
  /** ユーザーID */
  userId: string;
  /** スレッドID */
  threadId: string;
  /** ベクトルストア名 */
  vectorstoreTitle: string;
  /** ユーザー投稿内容 */
  userPost: string;
  /** AIからの回答内容 */
  aiResponse: string;
  /** 投稿日時 */
  timestamp: Date;
  /** レイテンシ */
  latency?: number;
  /** ユーザー側のトークン数 */
  userTokensNum: number;
  /** AI側のトークン数 */
  aiTokensNum: number;
  /** フィードバック結果 */
  feedbackStatus?: string;
  /** フィードバックコメント */
  feedbackComment?: string;
}
