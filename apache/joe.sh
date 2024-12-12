# domain: joe.sh
# public: /home/web/sites/joe.sh/

<VirtualHost *:80>
  ServerName www.joe.sh
  DirectoryIndex index.html index.php
  DocumentRoot /home/web/sites/joe.sh/public/

  # Remove www from domain
  RewriteEngine on
  RewriteCond %{HTTP_HOST} ^www\.
  RewriteRule ^(.*)$ http://joe.sh$1 [R=301,L]
</VirtualHost>
<VirtualHost *:80>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin me@joe.sh
  ServerName  joe.sh
  ServerAlias *.joe.sh

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.html index.php
  VirtualDocumentRoot /home/web/sites/%0/public
  # DocumentRoot /home/web/sites/joe.sh/public/

  # Log file locations
  LogLevel warn
  ErrorLog  /home/web/sites/joe.sh/log/error.log
  CustomLog /home/web/sites/joe.sh/log/access.log combined
</VirtualHost>
<IfModule mod_ssl.c>
<VirtualHost *:443>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin me@joe.sh
  ServerName  joe.sh
  ServerAlias *.joe.sh

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.html index.php
  VirtualDocumentRoot /home/web/sites/%0/public
  # DocumentRoot /home/web/sites/joe.sh/public/

  # Log file locations
  LogLevel warn
  ErrorLog  /home/web/sites/joe.sh/log/error.log
  CustomLog /home/web/sites/joe.sh/log/access.log combined

  SSLEngine on

  #   A self-signed (snakeoil) certificate can be created by installing
  #   the ssl-cert package. See
  #   /usr/share/doc/apache2.2-common/README.Debian.gz for more info.
  #   If both key and certificate are stored in the same file, only the
  #   SSLCertificateFile directive is needed.
  SSLCertificateFile    /etc/ssl/certs/ssl-cert.pem
  SSLCertificateKeyFile /etc/ssl/private/ssl-cert.key
</VirtualHost>
</IfModule>
