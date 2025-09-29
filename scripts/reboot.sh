curl \
  -H "Title: Server reboot initiated" \
  -H "Priority: urgent" \
  -H "Tags: facepalm" \
  -d "The server is being rebooted..." \
  ntfy.labuschagne.xyz/hp-all
echo "Sent reboot notification"
sudo reboot
