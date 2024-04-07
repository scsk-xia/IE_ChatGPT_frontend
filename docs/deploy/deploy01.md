 swa deploy ./out --env $ENV -n $StaticAPP -R $RG --no-use-keychain

Welcome to Azure Static Web Apps CLI (1.1.7)

(node:491698) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Deploying front-end files from folder:
  /home/mojiang/Development/Insight_Edge_GenAI/IE_ChatGPT_frontend/out

Consider providing api-language and version using --api-language and --api-version flags,
    otherwise default values apiLanguage: node and apiVersion: 16 will apply
Checking Azure session...
✔ Successfully logged into Azure!
✔ Choose your tenant › 2e05fa8b-0081-46a5-bcd7-110be228c653
✔ Successfully logged into Azure tenant: 2e05fa8b-0081-46a5-bcd7-110be228c653
✔ Saved project credentials in .env file.

Checking project "scskshgai-dev" settings...
✔ Successfully setup project!

Deploying to environment: dev


Error reading workflow configuration:
invalid property "jobs.build_and_deploy_job.steps[]" in the SWA workflow file "/home/mojiang/Development/Insight_Edge_GenAI/IE_ChatGPT_frontend/.github/workflows/azure-static-web-apps-deploy.yml".
See https://docs.microsoft.com/azure/static-web-apps/build-configuration?tabs=github-actions#build-configuration for more information.
Deploying project to Azure Static Web Apps...
Could not find StaticSitesClient local binary
[swa] ✔ Downloading https://swalocaldeploy.azureedge.net/downloads/1.0.026361/linux/StaticSitesClient@1.0.026361
✔ Project deployed to https://mango-rock-082e9df00-dev.eastasia.5.azurestaticapps.net 🚀