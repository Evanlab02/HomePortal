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
  -H \"Title: 🔄 Surprise! Time for another reboot!\" \
  -H \"Priority: urgent\" \
  -H \"Tags: computer,dizzy_face,warning\" \
  -H \"Click: https://giphy.com/gifs/have-you-tried-turning-it-off-and-on-again-F7yLXA5fJ5sLC\" \
  -d \"Your beloved server has decided it needs a little nap 💤 Don\'t worry, it\'ll be back faster than you can say \'have you tried turning it off and on again?\'\" \
  ntfy.labuschagne.xyz/hp-all
echo "Sent reboot notification"
sudo reboot
