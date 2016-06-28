<?php

$db_host = "localhost";
$db_username = "root";
$db_pass = "root";
$db_name = "peopledatabase";

@mysql_connect("$db_host", "$db_username", "$db_pass") or die ("could not connect to mySQL");

@mysql_select_db("$db_name") or die ("No database");

echo "Successful connection!"; 

?>