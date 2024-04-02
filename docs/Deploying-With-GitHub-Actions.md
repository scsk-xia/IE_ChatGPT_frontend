# GitHub Actions でのデプロイ

GitHub Actions によって、main ブランチにマージされたものが自動的にデプロイされる。

デプロイのためには、GitHub Actions に以下の Token を設定する
AZURE_STATIC_WEB_APPS_API_TOKEN は、Static Web Apps のページから取得できる。

```bash
AZURE_STATIC_WEB_APPS_API_TOKEN:
NEXT_PUBLIC_API_BASE_URL:
NEXT_PUBLIC_AZURE_TENANT_ID:
NEXT_PUBLIC_AZURE_APP_CLIENT_ID:
NEXT_PUBLIC_AZURE_AUTHORITY:
NEXT_PUBLIC_AZURE_KNOWN_AUTHORITY:
NEXT_PUBLIC_AZURE_API_SCOPE:
```

また、GitHub Actions 内で、Azure login するためにサービスプリンシパルを用いる
以下の CREDENTIALS をシークレットに登録する

```bash
AZURE_CREDENTIALS:{
  "clientId": "<AZURE_CLIENT_ID>",
  "clientSecret": "<AZURE_CLIENT_SECRET>",
  "subscriptionId": "<AZURE_SUBSCRIPTION_ID>",
  "tenantId": "<AZURE_TENANT_ID>"
}
```
