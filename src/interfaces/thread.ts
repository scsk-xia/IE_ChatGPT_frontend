export interface Thread {
  id: string;
  title: string;
  vectorstoreId?: string;
  type: string;
  chatGptModel?: string;
}
