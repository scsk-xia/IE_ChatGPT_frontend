# issue:Access to XMLHttpRequest at 'https://scskshgai-dev-web-app-api.azurewebsites.net/notice' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.

## solution:
Set CORS Rules:

Use the following command to set the CORS rules for your Azure Web App:

### 1. az webapp list --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}"

[
  {
    "Location": "East US",
    "Name": "scskshgai-dev-web-app-api",
    "ResourceGroup": "dev-scskshgai"
  }
]

### az webapp cors add --resource-group <resource-group-name> --name <webapp-name> --allowed-origins <origin1> <origin2> --allowed-methods GET POST PUT

az webapp cors add --resource-group dev-scskshgai --name scskshgai-dev-web-app-api --allowed-origins http://localhost:3000

result:
{
  "allowedOrigins": [
    "http://localhost:3000"
  ],
  "supportCredentials": false
}

