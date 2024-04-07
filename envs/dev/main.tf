# terraformのバージョン指定
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.65.0"
    }
  }
  # stateを管理するbackendの設定
  # {env}.tfbackendをinit時に注入する
  # e.g. sh tf.sh init -reconfigure -backend-config=dev.tfbackend
  backend "azurerm" {}
}

module "WebApps" {
  source              = "../../modules/WebApps"
  resource_group_name = var.resource_group_name
  env                 = var.env
  project_name        = var.project_name
  ass_location        = var.ass_location
  ass_plan            = var.ass_plan

}
