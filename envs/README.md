# フロントエンドのデプロイ手順について

ここでは、フロントエンドのデプロイについて記載する。
バックエンドのデプロイについては、[こちら](https://github.com/InsightEdgeJP/chatgpt-qa-backend/blob/main/envs/README.md)を確認ください。
フロントエンドのデプロイは以下の手順に分かれる

1. AzureAD アプリの作成
2. Azure リソースのデプロイ
3. Static Web Apps へのデプロイ
4. Azure AD(Azure AD B2C)へのエンドポイントの設定

## 1. Azure AD　アプリの作成

Azure ADの場合は、[Azure AD固有の設定について](../docs/setting-aad.md)を参考にAzure ADのアプリケーションを作成する。
Azure AD B2Cの場合は、[Azure AD B2C固有の設定について](../docs/setting-aadb2c.md)を参考にAzure AD B2Cのアプリケーションを作成する。

### Azure AD と Azure AD B2C の使い分けについて

二つの機能は特徴が以下の通り異なるため、目的・案件に応じて使い分けること。

| 機能名         | 説明                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `Azure AD`     | 組織内で一元管理が必要な場合、またはビジネスパートナーと連携する必要がある場合。                 |
| `Azure AD B2C` | エンドユーザー向けのアプリケーションを提供し、カスタマイズや大規模なユーザーベースが必要な場合。 |

## 2. Azure リソースのデプロイ

以下の操作は Azure リソースの環境構築として修正のない限り初めに一度だけ行う。
前提条件として、[ChatGPT 社則検索バックエンドデプロイ手順](https://github.com/InsightEdgeJP/chatgpt-qa-backend/blob/main/envs/README.md)が完了していること。

1. Azure リソースのデプロイ
   以下の手順に沿って terraform を実行し、「フロントエンド用の AzureAD アプリ」と「Static Web Apps」をデプロイする。

   1. `envs/<環境>` に移動
   2. `az login`
   3. `az account set --subscription <サブスクリプション名>`
   4. `terraform.tfvars.sample`を`terraform.tfvars`としパラメータを編集する。
   5. `terraform.tfbackend` を編集する
   6. `terraform init -reconfigure -backend-config=terraform.tfbackend`
   7. `terraform plan`
   8. `terraform apply`

2. 手順 1 で作成した「フロントエンド用の AzureAD アプリ」を Azure Portal で開き、クライアント ID とテナント ID を取得し、`.env.local`ファイルに記載する

## 3. Static Web Apps へのデプロイ

Static Web Apps には Production 環境と Preview 環境があり、Production 環境は安定したバージョンをデプロイする目的で、Preview 環境は一時的な利用を目的として利用されます。
開発環境については、Production 環境をステージング環境として、Preview 環境を開発環境として扱い、それぞれデプロイ方法は以下の通りです。

![swadev](images/dev-deploy-image.png)

本番環境では、Preview 環境は利用せず、最終的に提供する環境を Production 環境にデプロイします。
デプロイの方法については、案件や状況により選択してください。

![swaprd](images/prd-deploy-image.png)

### 事前準備

事前準備として以下のツールをインストールします

- Azure CLI
  - <https://learn.microsoft.com/ja-jp/cli/azure/install-azure-cli-macos>
- SWA CLI
  - <https://azure.github.io/static-web-apps-cli/docs/use/install/>

また、環境変数を設定しデプロイ前に接続する環境をご確認ください。
`.env.local.sample` をコピーして `.env.local` を作成し、Azure AD と Azure AD B2C を利用する場合でそれぞれ設定してください。変数の設定はそれぞれ以下を参考ください。

[Azure AD を利用している場合](../docs/setting-aad.md)

[Azure AD B2Cを利用している場合](../docs/setting-aadb2c.md)

### デプロイ

その後、以下のコマンドをプロジェクトのルートディレクトリで実行してください。
`sh build.sh <プレビュー環境名> <StaticWebAppsのアプリケーション名> <リソースグループ名>`
pnpm build
az login

本番環境へデプロイを行う場合は<プレビュー環境名>を`Production`としてください。

## 4. Azure AD(Azure AD B2C)へのエンドポイントの設定

デプロイされた環境へアクセスするためには、AzureAD(AzureAD B2C)へエンドポイントを設定する必要がある。設定済みの場合は、再設定は不要。

手順は以下の通り、

1. デプロイの際に表示される、URL をコピーする。(コピーを忘れた場合は Static Web Apps のページの[設定]-[環境]を開き、追加したい環境の[参照]ボタン押下することで取得できる)

2. 手順 1 で登録した AzureAD のアプリのページを開き、
    [概要]-[リダイレクト URI]から SPA のリダイレクト URI の追加を行う。
