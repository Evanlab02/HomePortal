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

# Send notification
"${CURL_CMD[@]}" \
  -H "Title: 🛑 The Great Server Hibernation of 2025" \
  -H "Priority: urgent" \
  -H "Tags: sleeping,power,warning" \
  -H "Click: https://www.youtube.com/watch?v=Gb2jGy76v0Y" \
  -d "Plot twist: The server is rage quitting! 😤 Time for its beauty sleep. Please don't panic - it's just having an existential crisis and needs some alone time 🧘‍♂️" \
  https://ntfy.labuschagne.xyz/hp-all
echo "Sent shutdown notification"
sudo shutdown -r +1
