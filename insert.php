


<!DOCTYPE html>
<html>
<head>
<title>PHP insertion</title>
<link href="insert.css" rel="stylesheet">
</head>
<body>
<div class="maindiv">
<!--HTML Form -->
<div class="form_div">
<div class="title">
<h2>Insert Data In Database Using PHP.</h2>
</div>
<form action="insert.php" method="post">
<!-- Method can be set as POST for hiding values in URL-->
<h2>Form</h2>
<label>First name:</label>
<input class="input" name="fname" type="text" value="">
<label>Lastname:</label>
<input class="input" name="lname" type="text" value="">
<!-- <label>Contact:</label>
<input class="input" name="contact" type="text" value="">
<label>Address:</label>
<textarea cols="25" name="address" rows="5"></textarea><br> -->
<input class="submit" name="submit" type="submit" value="Insert">
</form>
</div>
</div>
</body>
</html>

 
<?php
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



// Get values from form
$name=$_POST['fname'];
$lastname=$_POST['lname'];

echo "name is: ".$_POST['fname']." , lastname is ".$_POST['lname'];  


// Insert data into mysql
$sql="INSERT INTO `nametable` (`firstname`, `lastname`)VALUES('$name', '$lastname')";


// the important bit is to have the -> 
if ($connection->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $connection->error;
}



?>

