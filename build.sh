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