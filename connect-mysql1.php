<?php

DEFINE ('DB_USER', 'peopledatabase'); // works with peopledatabase because I have granted super privileges to this user
DEFINE ('DB_PSWD', 'evanthia1011');  //works with evanthia1011 because I have granted super privileges from the phpMyAdmin
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'peopledatabase'); //also works with test_database2

$db_name = 'peopledatabase';  




$con = mysqli_connect(DB_HOST, DB_USER, DB_PSWD, DB_NAME);



if(!$con)
	{
		die ('Not Connected to database Server');
	}

echo 'you have connected successfully' . "\xA\xA";

printf(PHP_EOL);

// Change database to "test"

$db_sel = mysqli_select_db($con,'peopledatabase');

if (!$db_sel)
  {
  echo "Failed to connect to db: ";
  }


if ($db_sel)
  {
  echo "connected to db:";
  }



// // make foo the current db
// $db_selected = mysqli_select_db('foo', $con);

// if (!$db_selected) {
    
//     die ('Can\'t use foo : ' . mysql_error());
// }


// if ($db_selected) {
    
//     echo ('use foo : ' . mysql_error());
// }



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