cd /var/www/sendy.tinylabs.app/html
rm yarn.lock
git fetch --all
git reset --hard origin/master
nvm use 12.13.0
yarn install
yarn build
cd dist
echo '
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>'>.htaccess
