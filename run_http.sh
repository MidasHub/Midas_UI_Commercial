# For install htttp_server run : npm -g install http-server
# -----------------------------------------------------------
# -p or --port Port to use (defaults to 8080)
# --cors Enable CORS via the Access-Control-Allow-Origin header
# -o [path] Open browser window after starting the server. Optionally provide a URL path to open. e.g.: -o /other/dir/
# -c Set cache time (in seconds) for cache-control max-age header, e.g. -c10 for 10 seconds (defaults to 3600). To disable caching, use -c-1.
# -U or --utc Use UTC time format in log messages.
# --log-ip Enable logging of the client's IP address (default: false).
# -S or --ssl Enable https.
# -C or --cert Path to ssl cert file (default: cert.pem).
# -K or --key Path to ssl key file (default: key.pem).
http-server -p 8080 -c-1 dist/web-app --ssl --cert ./key/cer.crt --key ./key/rsa.key