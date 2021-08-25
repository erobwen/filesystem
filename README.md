# Prerequisites

* Node.js

# Get started

Clone repository, then in your repository, run: 

* npm install

* npm start

This should open up the Metro Bundeler as a local web page. Press "Run in web browser" and a second window with your app will open.  


# Deploy
ec2-52-2-14-222.compute-1.amazonaws.com
scp -i ../keys/vsm_key_pair.pem ./target/deployments/*.war ec2-user@ec2-52-2-14-222.compute-1.amazonaws.com:~/new_release

ec2-52-2-14-222.compute-1.amazonaws.com
ec2-user
sudo su
yum update -y
yum install httpd -y
cd /var/www/html
service httpd start
chkconfig httpd on



# Notes
npm config set registry https://registry.erobwen.npme.io/

Serving on port 80
sudo ln -s /home/ec2-user/.nvm/versions/node/v13.11.0/bin/node /usr/bin/node
sudo ln -s /home/ec2-user/.nvm/versions/node/v13.11.0/bin/serve /usr/bin/serve
sudo serve floorspace -l 80 &

scp -i ../keys/vsm_key_pair.pem ./target/deployments/*.war ubuntu@ec2-3-82-251-137.compute-1.amazonaws.com:~/
ssh -i ../keys/vsm_key_pair.pem ubuntu@ec2-3-82-251-137.compute-1.amazonaws.com