curl \
  -H "Title: Performing Server Upgrade/Update..." \
  -H "Priority: urgent" \
  -H "Tags: rotating_light" \
  -d "The server is being upgraded/updated..." \
  ntfy.labuschagne.xyz/hp-all
echo "Sent upgrade notification"
sudo nala upgrade
curl \
  -H "Title: Completed Server Upgrade/Update." \
  -H "Priority: urgent" \
  -H "Tags: partying_face,tada" \
  -d "The server has been upgraded/updated." \
  ntfy.labuschagne.xyz/hp-all
echo "Sent upgrade completion notification"