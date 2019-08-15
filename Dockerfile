from nginx:latest

label maintainer="raowei <539277@qq.com>"

copy dist /usr/share/nginx/html

#定义时区参数
env TZ Asia/Shanghai

#设置时区
run ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo "$TZ" > /etc/timezone

expose 80