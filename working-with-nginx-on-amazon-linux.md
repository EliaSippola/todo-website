# Nginx on amazon linux

Installing and using nginx on Amazon Linux 2023.

also guides for setting up apache server to a folder, and creating SSL certificate with duckdns and letsencrypt
(https://www.duckdns.org/, https://letsencrypt.org/)

**These guides are not completely tested, and they are mostly what I could remembeer, or what worked for me**

## installation

run `sudo yum install nginx -y`

## Setting up for node server

you need a node server that is running on a specific port to make this work.

you can use `pm2` or some other function to run node server on the background.

(with pm2: `pm2 start app.js` and `pm2 save`. Check with `pm2 status [app name]`)


1. Redirecting service to node

modify file `/etc/nginx/nginx.conf`:

the next file only shows modifications

```ini
# ...
# Remove unneccessary includes to files
# These files are not needed if we don't need them.
# comment out the this include:
#include /usr/share/nginx/modules/*.conf;
# ...


# ...
# full http conf
http {

    # add these lines
    # link the paths to your ssl certificates (self made, or with other provider)
    # you can get free certificates from https://letsencrypt.org/
    ssl_certificate <path>/<cert>;
    ssl_certificate_key <path>/<key>;

    # don't touch these
    # ---
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;
    # ---

    # remove unnecessary include to .conf files
    # we will be only using the main conf
    # comment out this:
    #include /etc/nginx/conf.d/*.conf;

    # server config. This is the important section
    server {

        # first specify what port will listen to traffic

        # port 80 is http traffic
        # if you don't want to use http traffic at all, comment these out.
        # there is a guide below on how to redirect http traffic to https
        # IPv4
        listen 80 default_server;
        # IPv6
        listen [::]:80 default_server;

        # port 443 is https traffic
        # we want to enable ssl on this traffic
        # IPv4
        listen 443 ssl default_server;
        # IPv6
        listen [::]:443 ssl default server;

        # server name as blank
        server_name _;

        # comment out root.
        # this will open static file sharing on that root address (if allowed)
        # you don't need this to run node server
        #root /var/www/html/;

        # Comment out ocnfiguration files for default server block as well
        #include /etc/ginx/default.d/*.conf

        # You can also comment out the 404 and other error pages.
        # This just means that the error pages are not served by nginx, but instead by the client browser
        #error_page 404 /404.html;
        #location = /404.html {
        #}

        #error_page 500 502 503 504 /50x.html;
        #location = /50x.html {
        #}

        # then we setup the proxy pass to the node server port
        # with location / we are opening all adresses to node server ('/')
        location / {
            # set location of node server
            # node is running on localhost, and often on port 3000
            # put here your node servers port
            proxy_pass http://localhost:3000;
            # these are some settings that pass the correct data to node
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

    }

}
```

After setting up `/etc/nginx/nginx.conf`, we can restart nginx

run `sudo systemctl restart nginx` or `sudo systemctl start nginx`

You can also set nginx to enable on restart: `sudo systemctl enable nginx`

You can check the status with `sudo systemctl is-enabled nginx`

nginx should now redirect all traffic to node server.

## getting domain for letsencrypt

Letsencrypt doesn't allow aws domains, so we need to work around that. Create free domain that points to the aws server at https://www.duckdns.org/

Login, and make a domain with a name you choose (will end with duckdns.org).

Follow the installation guide at https://www.duckdns.org/install.jsp, choose ec2 as the install software.

**Remember to not run as root when creating the files. This will cause permission issues.**

## setting up certbot with nginx

Creating certificate with letsencrypt and certbot and using it in nginx
This guide doesn't use certbots automatic function, but instead uses the `certonly` method

check https://letsencrypt.org/ for more options

You can check the full guide at https://certbot.eff.org/, and choose `nginx` for software, and `Linux (pip)` for System.

You might need to remove certbot if you already have installation.

You can remove certbot with command `sudo dnf remove certbot`

1. install python and augeas lib for pip

`sudo dnf install python3 augeas-libs`

2. Set up python

`sudo python3 -m venv /opt/certbot/`
`sudo /opt/certbot/bit/pip install --upgrade pip`

3. install certbot

`sudo /opt/certbot/bin/pip install certbot`

4. Prepare certbot command to be used

`sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot`

5. get certificate

run `sudo certbot certonly --nginx` and answer to the questions asked.

You need to specify the domain names, and other stuff.

6. Set up nginx to use the certificates

open `/etc/nginx/nginx.conf`

modify
```ini
#...
http {

    # change these to the cerificate and key you got from certbot
    ssl_certificate <certificate location>;
    ssl_certificate_key <key location>;

    #...
```

check https://certbot.eff.org/instructions?ws=nginx&os=pip for more information

## Redirecting http traffic to https

Redirecting http traffic to https with nginx

open `/etc/rginx/nginx.conf`

modify the file:
```ini

#...
http {
    #...

    # don't change anything here

    #...

    # create new server section to handle the redirect
    server {
        
        # listen on http
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        # redirect all traffic to https
        # http code 301 means 'moved permamantly'
        # you can also use 307 (temporary redirect) or 308 (permament redirect)
        return 301 https://$host$request_uri;

    }

    # remove http listen from the original server section as well:
    server {

        # comment these out:
        #listen 80 default_server;
        #listen [::]:80 default_server;

        # leave https traffic untouched
        listen 443 ssl default_ser...
        # ...
```

run `sudo systemctl restart nginx` to restart nginx

nginx should now redirect to https when accessing website with http.

## Redirecting to apache server (because why not)

Redirecting to apache server if you want to host static php sites. (not sure if you can host php files with nginx)

install apache

`sudo dnf install -y httpd`

modify `/etc/nginx/nginx.conf`

```ini
#...
http {
    #...

    # don't touch these

    # ...

    # this is the https traffic configuration, if you are redirecting traffic from http
    server {

        # ...

        # don't touch these either

        # ...

        location / {

            # replace original with this:
            # you can choose any port that is not in use
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $remote_addr;
        }

        #...
```

now let's setup apache to run on different port

modify `/etc/httpd/conf/httpd.conf`

set
```ini
#...
# change listen to the port you set at nginx.
# this can be any port that is not in use.
# nginx uses 80, so we need to change it from the default 80
listen 8080
#...
```

now we can enable apache with:
`sudo systemctl start httpd` or `sudo systemctl restart httpd`

then let's set apache to start on every restart
`sudo systemctl enable httpd`

You should now be able to see static sites when you connect to the server on browser.

## Setting up different locations

Guide on how to setup different locations (like /home) to redirect to different services.

modify `/etc/nginx/nginx.conf`

```ini
# ...
http {
    #...
    # choose the server block you want to modify
    server {

        # if you want to server static files with nginx, you need to set root
        root /var/www/html

        # this will serve all files located at /var/www/html/files
        # default nginx can't server php files
        location /files {
        }

        # if you want to open other services (like node or apache) on different locations,
        # use the configurations that are listed above
        # and just change the location tag
        location /node {
            # node conf ...
        }

        # if you run apache server with static file hosting, apache will read the whole address.
        # this means that if you have location
        location /apache {
            # apache conf ...
        }
        # it will still serve files at /var/www/html/apache

        # you can edit the default file location at apache conf, or just deal with it

        # you can still have 'location / {...}' to redirect rest of the traffic there
        # even if you have set other locations like /store
    }
}
```

see https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/ for more info

## Returning 404 on nginx

if you want to return 404 status code, you can use the next coniguration:

modify `/etc/nginx/nginx.conf`

```ini
# ...
http {
    # ...
    server {
        # don't change listens
        # ...
        # just add this:
        location / {
            return 404;
        }
    }
}

```

## nginx docs: https://docs.nginx.com/nginx/