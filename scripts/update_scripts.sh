#!/bin/bash

date +[%H:%M\ %D] >> /var/log/update_script.log
apt-get full-upgrade >> /var/log/update_script.log
