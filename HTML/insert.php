<?php

	$con = mysql_connect('127.0.0.1', 'root', 'evanthia1011');

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
	
	$sql = "INSERT INTO mytable2 (USERNAME, email) VALUES ('$USERNAME','$Email')"

	if(!mysqli_query($con, $sql))

	{
		echo 'Not inserted into Database';

	}

	else
	{
		echo 'Inserted';
	}

	header("refresh:2; url=data_form.html");

	
?>