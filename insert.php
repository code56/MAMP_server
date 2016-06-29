


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

// inserting jhon and anymail@h.com works with this method. Inserting via the web form does not work yet. 
/*
$sql = "INSERT INTO nametable (firstname, lastname) VALUES ('jhon', 'anymail@h.com')"; 


if ($connection->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $connection->error;
}

*/

$sql="INSERT INTO 'nametable' ('fname', 'lname')

VALUES

('$_POST[fname]','$_POST[lname]')";

 

if (!mysqli_query($sql,$connection))

  {

  die('Error: ' . mysqli_error());

  }

echo "1 record added";

 





// if(isset($_POST['submit'])){ // Fetching variables of the form which travels in URL
// 	$fname = $_POST['firstname'];
// 	$lname = $_POST['lastname'];

// 	if($fname !=''||$lname !=''){
// // // //Insert Query of SQL

// 		mysqli_query($connection"INSERT INTO nametable (firstname,lastname) VALUES('$fname','$lname')");



// $query = mysqli_query("INSERT INTO nametable (firstname, lastname) VALUES ('$fname', '$lname')");
// echo "<br/><br/><span>Data Inserted successfully...!!</span>";
// }
// else{
// echo "<p>Insertion Failed <br/> Some Fields are Blank....!!</p>";
// }
// }

mysqli_close($connection); // Closing Connection with Server
?>

