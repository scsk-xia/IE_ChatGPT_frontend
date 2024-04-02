resource "azurerm_static_site" "static_website" {
  name                = "${var.project_name}-${var.env}"
  resource_group_name = var.resource_group_name
  location            = var.ass_location
  sku_size            = var.ass_plan
  sku_tier            = var.ass_plan
}

# 参考
# https://github.com/hashicorp/terraform-provider-azurerm/issues/18197
# https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/static_site
