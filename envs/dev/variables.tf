variable "env" {}
variable "project_name" {}
variable "resource_group_name" {}
variable "location" {}
variable "ass_location" {
    description = "Static Web appsのlocation ex) East Asia"
}
variable "ass_plan" {
    description = "Static Web appsのプラン ex) Standard"
}
variable "tenant_id" {}
variable "client_id" {}
variable "client_secret" {}
variable "subscription_id" {}