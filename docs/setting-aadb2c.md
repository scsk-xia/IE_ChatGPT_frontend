# Azure AD B2C の設定について

ここでは、Azure AD B2Cを扱う場合に必要な手順について記載する。

## Azure AD B2Cのアプリケーションを作成する

ここでは、フロントエンドのAzure AD B2Cの設定について記載する。
Azure AD B2Cは別途テナントを作成する必要があり、テナントの構築方法については、[バックエンドの環境構築ドキュメント](https://github.com/InsightEdgeJP/chatgpt-qa-backend/blob/main/envs/README.md)のAzureAD B2Cの作成・設定手順をご確認ください。

1. アプリケーションの作成

| 内容 | 例 |
| --- | --- |
| 名前 | <案件名>-frontend |
| サポートされているアカウントの種類 | 任意の ID プロバイダーまたは組織ディレクトリ内のアカウント (ユーザー フローを使用したユーザーの認証用) |
| リダイレクトURIのプラットフォーム| SPA |
| アクセス許可 | デフォルト |

2. APIのアクセス許可

アクセス許可の追加から、所属する組織で使用しているAPIを選択する。
するど、先ほど作成したAPIが表示されるので、user_impersonationを選択。
管理者の同意が必要となるので、「<テナント名>に管理者の同意を与えます」をクリックし、管理者の同意を追加する。

## 環境変数の設定

前提条件として、terraformでApp Serviceがデプロイされていること。AzureAD B2Cの作成が完了していること

1. `.env.local` に以下を設定する

```
NEXT_PUBLIC_API_BASE_URL=https://<App Service名>.azurewebsites.net/
NEXT_PUBLIC_AZURE_TENANT_ID=<Azure AD B2CのテナントID>
NEXT_PUBLIC_AZURE_APP_CLIENT_ID=<Azure AD B2C(フロントエンド)のアプリケーションクライアントID>
NEXT_PUBLIC_AZURE_AUTHORITY=https://<TENANT_NAME>.b2clogin.com/<TENANT_NAME>.onmicrosoft.com/B2C_1_signin
NEXT_PUBLIC_AZURE_KNOWN_AUTHORITY=<TENANT_NAME>.b2clogin.com
NEXT_PUBLIC_AZURE_API_SCOPE=https://<TENANT_NAME>.onmicrosoft.com/<Azure AD B2C(API)のアプリケーションクライアントID>/user_impersonation
```

### 参考資料

https://learn.microsoft.com/ja-jp/azure/active-directory-b2c/configure-authentication-in-azure-web-app