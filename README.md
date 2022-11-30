# Prerequisites

* Node.js

# Get started

Clone repository, then in your repository, run: 

* npm install

* npm start

This should open up the Metro Bundeler as a local web page. Press "Run in web browser" and a second window with your app will open.  


# Deploy to ec2-52-2-14-222.compute-1.amazonaws.com

## prepare server (from a clean debian install)
ssh -i ../keys/vsm_key_pair.pem admin@ec2-52-2-14-222.compute-1.amazonaws.com
sudo su
sudo apt update
sudo apt install apache2
systemctl status apache2
mkdir new_release

## build and copy files server
expo build:web
scp  -r -i ../keys/vsm_key_pair.pem ./web-build/* admin@ec2-52-2-14-222.compute-1.amazonaws.com:~/new_release/

## move to www
ssh -i ../keys/vsm_key_pair.pem admin@ec2-52-2-14-222.compute-1.amazonaws.com
mv /home/admin/new_release/* /var/www/html/

## Upgrade
npm audit fix --force
set NODE_OPTIONS=--openssl-legacy-provider
npx expo install @expo/webpack-config@^0.17.2