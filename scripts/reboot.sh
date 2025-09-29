curl \
  -H "Title: 🔄 Surprise! Time for another reboot!" \
  -H "Priority: urgent" \
  -H "Tags: computer,dizzy_face,warning" \
  -H "Click: https://giphy.com/gifs/have-you-tried-turning-it-off-and-on-again-F7yLXA5fJ5sLC" \
  -d "Your beloved server has decided it needs a little nap 💤 Don't worry, it'll be back faster than you can say 'have you tried turning it off and on again?'" \
  ntfy.labuschagne.xyz/hp-all
echo "Sent reboot notification"
sudo reboot
