pnpm install
Lockfile is up to date, resolution step is skipped
Packages: +1220
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 1220, reused 1218, downloaded 2, added 1220, done

dependencies:
+ @azure/msal-browser 2.37.1
+ @azure/msal-react 1.5.8
+ @azure/storage-blob 12.15.0
+ @emotion/react 11.11.1
+ @emotion/server 11.11.0
+ @mantine/core 6.0.15
+ @mantine/dates 6.0.19
+ @mantine/dropzone 6.0.17
+ @mantine/form 6.0.15
+ @mantine/hooks 6.0.15
+ @mantine/notifications 6.0.21
+ @svgr/webpack 8.1.0
+ @tabler/icons-react 2.23.0
+ axios 1.4.0
+ axios-hooks 4.0.0
+ camelcase-keys 8.0.2
+ dayjs 1.11.8
+ next 13.4.7
+ react 18.2.0
+ react-dom 18.2.0
+ react-markdown 8.0.7
+ rehype-raw 7.0.0
+ rehype-sanitize 6.0.0
+ remark-gfm 3.0.1
+ svgo 3.0.2
+ swr 2.2.0
+ ulid 2.3.0

devDependencies:
+ @azure/static-web-apps-cli 1.1.3
+ @testing-library/dom 9.3.1
+ @testing-library/jest-dom 5.16.5
+ @testing-library/react 14.0.0
+ @testing-library/user-event 14.4.3
+ @trivago/prettier-plugin-sort-imports 4.1.1
+ @types/jest 29.5.2
+ @types/node 20.3.2
+ @types/react 18.2.14
+ @types/react-dom 18.2.6
+ @types/testing-library__jest-dom 5.14.6
+ @typescript-eslint/eslint-plugin 5.60.1
+ @typescript-eslint/parser 5.60.1
+ eslint 8.43.0
+ eslint-config-next 13.4.7
+ eslint-config-prettier 8.8.0
+ eslint-plugin-jest 27.2.2
+ eslint-plugin-jest-dom 5.0.1
+ eslint-plugin-testing-library 5.11.0
+ eslint-plugin-unused-imports 2.0.0
+ jest 29.5.0
+ jest-environment-jsdom 29.5.0
+ jsdom 22.1.0
+ prettier 2.8.8
+ typescript 5.1.3

Done in 2.8s
mojiang@YanWorkstation:~/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend$ pnpm build

> template-nextjs-frontend@0.1.0 build /home/mojiang/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend
> next build

- info Loaded env from /home/mojiang/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend/.env.local
- info Linting and checking validity of types
Browserslist: caniuse-lite is outdated. Please run:
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating
- info Creating an optimized production build
- info Compiled successfully
- info Collecting page data
- info Generating static pages (6/6)
- info Finalizing page optimization

Route (pages)                              Size     First Load JS
┌ ○ / (408 ms)                             71.1 kB         377 kB
├   /_app                                  0 B             202 kB
├ ○ /404                                   180 B           202 kB
├ ○ /admin (331 ms)                        2.94 kB         249 kB
├ ○ /admin/chat-histories (404 ms)         28 kB           334 kB
└ ○ /admin/notice-editor (328 ms)          5.95 kB         258 kB
+ First Load JS shared by all              202 kB
  ├ chunks/framework-6698976aa0ea586d.js   45.2 kB
  ├ chunks/main-2e184c1cef19ec3b.js        27.7 kB
  ├ chunks/pages/_app-fd907b4778ecfdc8.js  128 kB
  ├ chunks/webpack-6c3759321fc0b2c3.js     953 B
  └ css/339f47da4ac35a96.css               319 B

○  (Static)  automatically rendered as static HTML (uses no initial props)

mojiang@YanWorkstation:~/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend$ swa deploy ./out --env $ENV -n $StaticAPP -R $RG --no-use-keychain

Welcome to Azure Static Web Apps CLI (1.1.7)

(node:49508) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Deploying front-end files from folder:
  /home/mojiang/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend/out

Consider providing api-language and version using --api-language and --api-version flags,
    otherwise default values apiLanguage: node and apiVersion: 16 will apply
Checking Azure session...
✔ Successfully logged into Azure!
✔ Choose your tenant › c19c319a-2ffc-432c-ab0f-51749d55c145
✔ Successfully logged into Azure tenant: c19c319a-2ffc-432c-ab0f-51749d55c145
✖ No valid subscription found for tenant c19c319a-2ffc-432c-ab0f-51749d55c145.
  Please read https://docs.microsoft.com/azure/cost-management-billing/manage/no-subscriptions-found
mojiang@YanWorkstation:~/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend$ swa deploy ./out --env $ENV -n $StaticAPP -R $RG --no-use-keychain

Welcome to Azure Static Web Apps CLI (1.1.7)

(node:50409) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Deploying front-end files from folder:
  /home/mojiang/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend/out

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
invalid property "jobs.build_and_deploy_job.steps[]" in the SWA workflow file "/home/mojiang/Development/Insight_Edge_GenAI/IE_gitclone_01/chatgpt-scsk-shanghai-frontend/.github/workflows/azure-static-web-apps-deploy.yml".
See https://docs.microsoft.com/azure/static-web-apps/build-configuration?tabs=github-actions#build-configuration for more information.
Deploying project to Azure Static Web Apps...
✔ Project deployed to https://green-sea-038355000-dev.eastasia.5.azurestaticapps.net 🚀
