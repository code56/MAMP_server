<?php

DEFINE ('DB_USER', 'root');
DEFINE ('DB_PSWD', 'evanthia1011');
DEFINE ('DB_HOST', 'localhost:8889');
DEFINE ('DB_NAME', 'root');





$con = mysqli_connect(DB_HOST, DB_USER, DB_PSWD, DB_NAME);



if(!$con)
	{
		die ('Not Connected to database Server';
	}

echo 'you have connected successfully';



	
?>