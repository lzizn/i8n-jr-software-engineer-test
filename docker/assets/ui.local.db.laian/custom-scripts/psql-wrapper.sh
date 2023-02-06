#!/usr/bin/env bash

SECONDS=0

action=$1
dumpname=$2
# pg_dump/format available values: plain custom directory tar
dump_format=${3:-plain}
#dump_format=plain


pg_hostname=$POSTGRES_HOST
pg_database=$POSTGRES_DB        #  laianDevDB
pg_username=$POSTGRES_USER      #  user
pg_password=$POSTGRES_PASSWORD  #  pwd123
pg_port=5432


now=$(date -u +%Y-%m-%dT%H%M%SZ)
dumpname=${dumpname:-"$now-$pg_database.$dump_format"}
dumppath="/laian/db-backups/$dumpname"


exitcode=0

case $action in

	backup | dump)
		# https://www.postgresql.org/docs/9.3/app-pgdump.html

		#PGPASSWORD=$pg_password pg_dump    --host="$pg_hostname" --port="$pg_port" --username="$pg_username" --dbname="$pg_database" --file="$dumppath" --verbose --format=plain --compress="5" --encoding="UTF8"
		PGPASSWORD=$pg_password pg_dump    --host="$pg_hostname" --port="$pg_port" --username="$pg_username" --dbname="$pg_database" --file="$dumppath" --verbose --clean --create --format="$dump_format" --encoding="UTF8"
		exitcode=$?

		echo "DUMP DONE"
		echo "	  file: $dumpname"
		;;

	restore)

		# we use `postgres` DB on restore, because DUMP script contains instructions for
		# drop/reconnect to the proper database, but we can't rename the DB
		# it will always have the same name as the dumped DB

		if [ $dump_format = 'plain' ]; then

			# https://www.postgresql.org/docs/9.1/backup-dump.html

			#PGPASSWORD=$pg_password psql       --host "$pg_hostname" --port "$pg_port" --username "$pg_username" --dbname "$pg_database" --file "$dumppath"
			PGPASSWORD=$pg_password psql       --host "$pg_hostname" --port "$pg_port" --username "$pg_username" --dbname "postgres"     --file "$dumppath"
			exitcode=$?
		else
			# https://www.postgresql.org/docs/9.3/app-pgrestore.html

			# awkward, but::: pg_restore: options -d/--dbname and -f/--file cannot be used together
			#PGPASSWORD=$pg_password pg_restore --host="$pg_hostname" --port="$pg_port" --username="$pg_username" --dbname="$pg_database" --clean --create "$dumppath"
			PGPASSWORD=$pg_password pg_restore --host="$pg_hostname" --port="$pg_port" --username="$pg_username" --dbname="postgres"     --clean --create "$dumppath"
			exitcode=$?
		fi

		echo "RESTORING FINISHED, exit code (0 = success): $exitcode"
		;;
	*)
		echo 'USAGE: psql-wrapper <backup|restore|help> <backup-name>'
		;;
esac


echo "Finished after: $SECONDS sec"
echo "            at: $(date +%Y-%m-%dT%H:%M:%S%z)"

exit $exitcode
