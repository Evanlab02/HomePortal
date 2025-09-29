#!/bin/bash

# Parse command line arguments
AUTH_HEADER=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --auth)
      AUTH_HEADER="Authorization: Bearer $2"
      shift 2
      ;;
    --auth-user)
      ENCODED=$(echo -n "$2" | base64)
      AUTH_HEADER="Authorization: Basic $ENCODED"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--auth TOKEN | --auth-user USER:PASS]"
      exit 1
      ;;
  esac
done

# Build curl command with optional auth
CURL_CMD=(curl)
if [[ -n "$AUTH_HEADER" ]]; then
  CURL_CMD+=(-H "$AUTH_HEADER")
fi

# Send upgrade start notification
"${CURL_CMD[@]}" \
  -H "Title: 🚀 Server Glow-Up Transformation!" \
  -H "Priority: urgent" \
  -H "Tags: rocket,sparkles,hammer_and_wrench" \
  -H "Click: https://giphy.com/gifs/loading-computer-cat-JIX9t2j0ZTN9S" \
  -d "Breaking news: Your server is getting a makeover! 💅 Time to upgrade from peasant packages to fancy new ones. This might take a while, so grab some coffee ☕" \
  https://ntfy.labuschagne.xyz/hp-all
echo "Sent upgrade notification"
sudo nala upgrade

# Send upgrade completion notification
"${CURL_CMD[@]}" \
  -H "Title: 🎉 Mission Accomplished (Probably)!" \
  -H "Priority: urgent" \
  -H "Tags: partying_face,tada,checkered_flag" \
  -H "Click: https://www.youtube.com/watch?v=LDU_Txk06tM" \
  -d "Ta-da! 🎭 Your server has successfully survived another upgrade! It's now 0.001% more awesome and 99% more likely to work... hopefully" \
  https://ntfy.labuschagne.xyz/hp-all
echo "Sent upgrade completion notification"