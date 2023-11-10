#!/bin/bash

sudo apt update -q
sudo apt install nodejs npm -q
npm install -g n
n stable
pip install -q -U -r requirement.txt
(cd react-app; npm install; npm run build)


