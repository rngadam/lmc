. ~/local/env.sh
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -t nat -A OUTPUT --src 0/0 --dst 127.0.0.1 -p tcp --dport 80 -j REDIRECT --to-ports 8080
nodemon app.js
