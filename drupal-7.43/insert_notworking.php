<html>

<body>

<?php

/*DEFINE ('DB_USER', 'root'); // works with peopledatabase because I have granted super privileges to this user
DEFINE ('DB_PSWD', 'root');  //works with evanthia1011 because I have granted super privileges from the phpMyAdmin
DEFINE ('DB_HOST', 'localhost');
DEFINE ('DB_NAME', 'peopledatabase'); //also works with test_database2


$con = mysqli_connect(DB_HOST, DB_USER, DB_PSWD, DB_NAME);*/

$con = mysql_connect("localhost","cis_id","password");

if (!$con)

  {

  die('Could not connect: ' . mysqli_error());

  }

 

mysqli_select_db("cis_id", $con);

 

$sql="INSERT INTO nametable (fname, lname)

VALUES

('$_POST[fname]','$_POST[lname]')";

 

if (!mysqli_query($sql,$con))

  {

  die('Error: ' . mysqli_error());

  }

echo "1 record added";

 

mysqli_close($con)

?>

</body>

</html>

 