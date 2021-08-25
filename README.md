# Prerequisites

* Node.js

# Get started

Clone repository, then in your repository, run: 

* npm install

* npm start

This should open up the Metro Bundeler as a local web page. Press "Run in web browser" and a second window with your app will open.  


# Deploy
ec2-52-2-14-222.compute-1.amazonaws.com
scp -i ../keys/vsm_key_pair.pem ./web-build/* admin@ec2-52-2-14-222.compute-1.amazonaws.com:~/new_release

ssh -i ../keys/vsm_key_pair.pem admin@ec2-52-2-14-222.compute-1.amazonaws.com
sudo su
sudo apt update
sudo apt install apache2
systemctl status apache2
root@ip-172-31-44-192:/var/www/html# mv /home/admin/new_release/* .



# Notes

Serving on port 80
sudo ln -s /home/ec2-user/.nvm/versions/node/v13.11.0/bin/node /usr/bin/node
sudo ln -s /home/ec2-user/.nvm/versions/node/v13.11.0/bin/serve /usr/bin/serve
sudo serve floorspace -l 80 &

scp -i ../keys/vsm_key_pair.pem ./target/deployments/*.war ubuntu@ec2-3-82-251-137.compute-1.amazonaws.com:~/
ssh -i ../keys/vsm_key_pair.pem ubuntu@ec2-3-82-251-137.compute-1.amazonaws.com