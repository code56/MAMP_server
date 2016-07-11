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
  echo "Failed to connect to db";
  }


if ($db_sel)
  {
  echo "connected to db";
  }


// insert data into the table 

$sql = "INSERT INTO tablepeople (username, email) VALUES ('jhon', 'anymail@h.com')"; 


if ($con->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $con->error;
}

if (isset($_POST['submitted'])) {

	include('connect-mysql1.php');

	$uname = $_POST['username'];
	$email = $_POST['email'];
	$sqlinsert = "INSERT INTO tablepeople (username, email) VALUES ($uname, $email)";

	if (!mysqli_query($con, $sqlinsert))  {
		die ('error inserting new record');
		} // end of my nested if statement

	$newrecord = "1 record added to db";

}  // end of the main if statement




?>

<!-- 
<html>

<head>

<title>Insert Data into DB</title>

</head>

<body>


<h1> Insert Data into DB</h1>

<form method="post" action="connect-mysql1.php">  
<input type="hidden" name="submitted" value="true" />

<fieldset>
	<legend>New People</legend>
	<label>Username:<input type:"text" name="username" /></label>
	<label>email: <input type= "text" name="email"/></label>

</fieldset>

<br />

<input type="submit" value="add new person" />

</form>

<?php
echo $newrecord 
?> 

</body>

</html>




 -->