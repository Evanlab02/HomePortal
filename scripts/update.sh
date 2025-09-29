#!/bin/bash

# Parse command line arguments
AUTH_HEADER=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --auth)
      AUTH_HEADER="-H \"Authorization: Bearer $2\""
      shift 2
      ;;
    --auth-user)
      ENCODED=$(echo -n "$2" | base64)
      AUTH_HEADER="-H \"Authorization: Basic $ENCODED\""
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--auth TOKEN | --auth-user USER:PASS]"
      exit 1
      ;;
  esac
done

# Send notification with optional auth
eval curl $AUTH_HEADER \
  -H \"Title: 📦 Package Therapy Session Starting!\" \
  -H \"Priority: default\" \
  -H \"Tags: package,arrows_counterclockwise,sparkles\" \
  -H \"Click: https://xkcd.com/1197/\" \
  -d \"Time for the server\'s monthly vitamin supplements! 💊 All those outdated packages are about to get a reality check. Don\'t worry, I promise this won\'t hurt... much 😈\" \
  ntfy.labuschagne.xyz/hp-all
echo "Sent update notification"
sudo nala update