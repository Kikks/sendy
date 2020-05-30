cd /var/www/staging.sendy.tinylabs.app/html
rm yarn.lock
git fetch --all
git reset --hard origin/staging
nvm use 12.13.0
yarn config set ignore-engines true
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
