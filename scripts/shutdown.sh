curl \
  -H "Title: Server shutdown initiated" \
  -H "Priority: urgent" \
  -H "Tags: facepalm" \
  -d "The server is being shutdown..." \
  ntfy.labuschagne.xyz/hp-all
echo "Sent shutdown notification"
sudo shutdown
