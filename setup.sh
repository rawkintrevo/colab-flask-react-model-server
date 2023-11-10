#!/bin/bash

sudo apt update -q
sudo apt install nodejs npm -q
npm install -g n
n stable
sudo apt remove python3-blinker
pip install -q -U -r requirements.txt
(cd react-app; npm install; npm run build)


