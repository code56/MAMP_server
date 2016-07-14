<?php

if (isset($_POST['submitted'])) {

	include('connect-mysql.php');

	$fname = $_POST['fname'];
	$lname = $_POST['lname'];
	$sqlinsert = "INSERT INTO mytable2 (firstname, lastname) VALUES ('$fname', '$lname')";

	if (!mysqli_query($con, $sqlinsert)) {
		die ('error inserting new record');
		} // end of my nested if statement 

		$newrecord = "1 record added to the database";


} // end of the main if statement





?>





<html>

<head>

<title>Insert Data into DB</title>

</head>

<body>


<h1> Insert Data into DB</h1>

<form method="post" action="insert-data.php">
<input type="hidden" name="submitted" value="true" />

<fieldset>
	<legend>New People</legend>
	<label>First Name:<input type:"text" name="fname" /></label>
	<label>Last Name: <input type= "text" name="lname"/></label>

</fieldset>

<br />

<input type="submit" value="add new person" />

</form>

<?php
echo $newrecord 
?> 

</body>

</html>

