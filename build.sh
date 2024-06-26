#!/bin/bash

ENV=$1
APPLICATION=$2
RESOURCE_GROUP=$3

# Build the project
pnpm build

# login
az login

# Deploy the project
swa deploy ./out --env $ENV -n $APPLICATION -R $RESOURCE_GROUP


# my
# pnpm build
# az login --tenant $TENANT_ID
# source /home/mojiang/Dev/IE_ChatGPT_POC/IE_Chatgpt_backend/env_vars.sh
# swa deploy ./out --env $ENV -n $StaticAPP -R $RG --no-use-keychain

