# 概要

ChatGPT プロジェクトにおける情報検索パターンのフロントエンド Web アプリです。Next.js による SPA として実装されています。

## 前提条件

本アプリは、以下の環境で開発を行うことを前提としています。
- az login --tenant $TENANT_ID

- Visual Studio Code
  - 以下の拡張機能を入れること。
    - Prettier
    - ESLint
- Node.js >= 16.20
  - node --version
- pnpm > 8.6.0
  - pnpm --version


## 環境変数

`.env.local.sample` をコピーして `.env.local` を作成し、以下の環境変数を設定してください。

| 環境変数名                          | 説明                                                                                                                                                        | 必須 or デフォルト値 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `NEXT_PUBLIC_API_BASE_URL`          | バックエンド API サーバーのエンドポイント URL                                                                                                               | 必須                 |
| `NEXT_PUBLIC_AZURE_TENANT_ID`       | Azure AD 認証を利用する場合、Azure AD のテナント ID                                                                                                         | 必須                 |
| `NEXT_PUBLIC_AZURE_AUTHORITY`       | 認証に使用する Authority。Azure AD の場合 `https://login.microsoftonline.com/<テナントID>`                                                                  | 必須                 |
| `NEXT_PUBLIC_AZURE_KNOWN_AUTHORITY` | 認証に使用を許可する Authority。 `NEXT_PUBLIC_AZURE_AUTHORITY` のプロトコル+オーソリティまで。Azure AD の場合 `https://login.microsoftonline.com/`          | 必須                 |
| `NEXT_PUBLIC_AZURE_APP_CLIENT_ID`   | Azure AD に登録したアプリケーション(フロントエンド)のクライアント ID                                                                                        | 必須                 |
| `NEXT_PUBLIC_AZURE_API_SCOPE`       | バックエンド API サーバーでユーザー認証をする場合、Azure AD に登録したバックエンド API のスコープ。 |          必須            |
| `NEXT_PUBLIC_APP_TITLE`             | ブラウザのタブに表示されるアプリケーションのタイトル                                                                                                        | `Demo`               |
| `NEXT_PUBLIC_COLOR_THEME`           | アプリ全体に適用されるカラーテーマ                                                                                                                          | `default`            |

## ローカル起動方法
az login -tenant 
1. 「環境変数」の章に沿って、.env.local ファイルを作成する。
1. 以下を実行し、ライブラリをインストールする。
   - > pnpm install
1. 以下を実行し、起動する。
   - > pnpm dev
1. ブラウザで"localhost:3000"にアクセスする。

## デプロイ手順

アプリケーションの構築手順については、開発環境と本番環境で大きな違いはないため
[フロントエンドのデプロイ手順について](../envs/README.md)に記載する。

また、バックエンドについては[こちら](https://github.com/InsightEdgeJP/chatgpt-qa-backend/blob/main/envs/README.md)を参考にすること。

## IP 制限の実施方法

Static Web Apps の設定は`staticwebapp.config.json`を用いて行われる。
この設定ファイルは Static Web Apps にデプロイされる際に、読み込まれるので Azure Portal 上では設定ができない。
そのため、デプロイの際にファイルに含める必要がある。

IP 制限のために必要な内容は以下の通り、

```json
{
  "networking": {
    "allowedIpRanges": ["100.0.0.0/32"]
  }
}
```

1. プロジェクトのルートディレクトリに`staticwebapp.config.json`を追加
2. `sh build.sh <プレビュー環境名> <StaticWebAppsのアプリケーション名> <リソースグループ名>`

### 参考

https://learn.microsoft.com/ja-jp/azure/static-web-apps/private-endpoint

## カラーテーマについて

### カラーテーマの切り替え

環境変数の設定にて、「NEXT_PUBLIC_COLOR_THEME」の値を設定することで、アプリ全体に適用されるカラーテーマを変更することができる。用意されているカラーテーマは以下。

| 設定値       | 説明       |
| ------------ | ---------- |
| `default`    | 基本カラー |
| `monochrome` | モノクロ系 |
| `red`        | レッド系   |
| `blue`       | ブルー系   |
| `green`      | グリーン系 |

### カラーテーマのカスタマイズ方法

`.\src\constants\index.ts`内の`PALETTES`変数に設定を追加し、環境変数で追加した設定を指定することで、カスタマイズしたカラーテーマを利用できる。１つのカラーテーマに必要な色は以下の５色。

| キー | 色の基本ルール                           | 説明                                                                                                                                       |
| ---- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 0    | ブランドカラー                           | アプリ全体のメインとなる色。各種実行ボタンの塗りつぶしや各種キャンセルボタンの枠線の色、「+ New chat」ボタンをホバー時の背景色に使われる。 |
| 1    | ブランドカラー（opacity: 10%）           | チャット画面内のガイドボタンの背景色や、ブランドカラーが枠色に使われているボタン（各種キャンセルボタン）のホバー時の背景色に使われる。     |
| 2    | ブランドカラー（opacity: 20%）           | 「+ New chat」ボタンの背景色や、ガイドボタンをホバー時の背景色に使われる。                                                                 |
| 3    | ブランドカラー + #000000（opacity: 10%） | ブランドカラーで塗りつぶされたボタン（各種実行ボタン）のホバー時の背景色に使われる。                                                       |
| 4    | ブランドカラー + #000000（opacity: 40%） | スレッド一覧内の、選択中のスレッドを表す色に使われる。                                                                                     |
| 5    | ブランドカラー + #000000（opacity: 60%） | スレッド一覧の背景色に使われる。                                                                                                           |
| 6    | `#E03131`                                | スレッド削除の削除ボタンの背景色に使われる。                                                                                               |
| 7    | `#C92A2A`                                | スレッド削除の削除ボタンをホバー時の背景色に使われる。                                                                                     |
| 8    | `#868E96`                                | スレッド削除のキャンセルボタンの枠色に使われる。                                                                                           |
| 9    | `#E5E5E5`                                | スレッド削除のキャンセルボタンをホバー時の背景色に使われる。                                                                               |

▼ 設定例 (オレンジ系を追加する場合。下記の記述を追加後、環境変数で`custom`と指定することで利用できるようになる。)

```typescript
const PALETTES: { [key: string]: ColorPalette } = {
  // 中略
  custom: {
    0: "#FFA500",
    1: "#FFF6E5",
    2: "#FFEDCC",
    3: "#E59400",
    4: "#996300",
    5: "#664200",
    6: "#E03131",
    7: "#C92A2A",
    8: "#868E96",
    9: "#E5E5E5",
  },
};
```
