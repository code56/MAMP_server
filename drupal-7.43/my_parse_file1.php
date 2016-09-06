<?php 
//echo 'Thank you '. $_POST['firstname'] . ' ' . $_POST['lastname'] . ', says the PHP file';


$connection = mysqli_connect("localhost", "peopledatabase", "evanthia1011"); // Establishing Connection with Server

if(!$connection)
	{
		die ('Not Connected to database Server');
	}

echo 'you have connected successfully' . "\xA\xA";


$db = mysqli_select_db("peopledatabase", $connection); // Selecting Database from Server

$db = mysqli_select_db($connection,'peopledatabase');

if (!$db)
  {
  echo "Failed to connect to db";
  }


if ($db)
  {
  echo "connected to db";
  }

//ini_set('display_errors', 1);*/


// Get values from form
$name=$_POST['firstname'];
$lastname=$_POST['lastname'];

echo "name is: ".$_POST['firstname']." , lastname is ".$_POST['lastname'];  


// Insert data into mysql
$sql="INSERT INTO `nametable` (`firstname`, `lastname`)VALUES('$name', '$lastname')";


// the important bit is to have the -> 
if ($connection->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $connection->error;
}


?>