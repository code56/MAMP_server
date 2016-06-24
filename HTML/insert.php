<?php

	$con = mysql_connect('localhost', 'root', 'evanthia1011');

	if(!con)
	{
		echo 'Not Connected to database Server';
	}

	if(!mysqli_select_db($con, 'InteractiveFigure'))
	{
		echo 'Database Not Selected';
	}

	$Name = $_POST['username'];
	$Email = $_POST['email'];
	
	$sql = "INSERT INTO page_data (page_name, page_title) VALUES ('$username','$Email')"

	if(!mysqli_query($con, $sql))

	{
		echo 'Not inserted into Database';

	}

	else
	{
		echo 'Inserted';
	}

	header("refresh:2; url=index.html");


?>