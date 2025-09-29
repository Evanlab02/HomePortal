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
  -H \"Title: 🧪 Mad Science in Progress!\" \
  -H \"Priority: default\" \
  -H \"Tags: test_tube,microscope,warning\" \
  -H \"Click: https://giphy.com/gifs/mrw-post-vote-YYfEjWVqZ6NDG\" \
  -d \"Alert! Your friendly neighbour is poking the server with a stick again 🥸 Things might get weird... or explode... or both! Consider this your warning and maybe go touch some grass 🌱\" \
  ntfy.labuschagne.xyz/hp-all
echo "Sent testing notification"
