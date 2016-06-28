<?php

DEFINE ('DB_USER', 'root'); // cannot work with peopledatabase
DEFINE ('DB_PSWD', 'root');  //cannot work with evanthia1011
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'peopledatabase'); //also works with test_database2

$db_name = 'peopledatabase';  




$con = mysqli_connect(DB_HOST, DB_USER, DB_PSWD, DB_NAME);



if(!$con)
	{
		die ('Not Connected to database Server');
	}

echo 'you have connected successfully';

/*
$con_db = mysqli_select_db(DB_NAME);

if (!$con_db)
	{
		die ('Not connected to database');
	}

echo 'you found database';*/


// @mysqli _select_db('$db_name') or die ('No database');




	
?>

<!-- comment here about what is going on -->