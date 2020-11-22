#!/bin/sh
REACT_APP_ENDPOINT="https://hacktivity-296321.ew.r.appspot.com/" PUBLIC_URL="https://storage.googleapis.com/hacktivity-296321.appspot.com" npm run build
cd build
gsutil rm gs://hacktivity-296321.appspot.com/**  
gsutil -h "Cache-Control:no-cache,max-age=0" cp -r . gs://hacktivity-296321.appspot.com