#!/bin/bash

hash=`cat /var/log/checksum_crontab | cut -d' ' -f1`

if [[ $(md5sum /etc/crontab | cut -d' ' -f1) != $hash ]]
then
	echo "Crontab File Changed"
	echo "Crontab Changed Recently" | mail -s "crontab" root
	md5sum /etc/crontab > /var/log/checksum_crontab
fi
