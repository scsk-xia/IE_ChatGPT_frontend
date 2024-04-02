# Azure AD固有の設定について

## Azure ADのアプリケーションを作成する

以下の作業は認証にAzure ADを利用する場合にのみ行なってください。

1. [アプリの登録]から[新規登録]を押下
2. 以下のパラメータを設定し登録する。

    | 内容 | 入力内容 | 例|
    | --- | --- | --- |
    | 名前 | [案件名]-[環境名]-frontend | iechatgpt-dev-frontend |
    | サポートされているアカウントの種類 | この組織ディレクトリに~ | |
    | リダイレクトURI(プラットフォーム) | シングルページアプリケーション(SPA) | |
    | リダイレクトURI(URI) | http://localhost:3000 (都度環境が立ち上がったらそのページを追加で設定する) |

3. APIのアクセス許可

- アクセス許可の追加から、所属する組織で使用しているAPIを選択する。
- バックエンドの作成手順で作成したアプリケーションを検索・選択する
- 先ほど作成したAPIが表示されるので、user_impersonationを選択。

## 環境変数の設定

1. `.env.local`に以下を設定する

```
NEXT_PUBLIC_API_BASE_URL=https://<Cloud Frontのエンドポイント>/
NEXT_PUBLIC_AZURE_TENANT_ID=<Azure AD のテナントID>
NEXT_PUBLIC_AZURE_APP_CLIENT_ID=<Azure AD(フロントエンド)のアプリケーションクライアントID>
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/<Azure AD のテナントID>
NEXT_PUBLIC_AZURE_KNOWN_AUTHORITY=https://login.microsoftonline.com/
NEXT_PUBLIC_AZURE_API_SCOPE=api://<登録したアプリケーション(API)のクライアントID>/user_impersonation
```