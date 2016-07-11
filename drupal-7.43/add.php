
<?php
	if (! empty($_POST))
	{
		echo '<pre>';
			print_r($_POST);
		echo '</pre>';
	}//endif
	
	define('TABLE_NAME', 	'information_002');
	
	define('HOST_NAME', 	'localhost');
	define('USER_NAME', 	'root');
	define('PASSWORD', 	'root');
	define('DATABASE',	'peopledatabase');
	
	$link=mysqli_connect
	(
		HOST_NAME, 
		USER_NAME, 
		PASSWORD
      )  or die('Cannot connect to the database  because: ' . mysqli_error());

	mysqli_select_db (DATABASE);
	echo '<br />Connected OK:';
	
	$sql =	'CREATE TABLE IF NOT EXISTS ' .TABLE_NAME 
				.	'(
						 id INT NOT NULL AUTO_INCREMENT,
						 name 		VARCHAR (40),
						 email 		VARCHAR (40),
						 opinion 	VARCHAR (30),
						 PRIMARY	KEY (id)
						);
					';	
	echo '<br />'.TABLE_NAME .' table created: : '. $result = mysqli_query($sql);
	
	echo '<br />'.mysqli_error(); 
	echo 'Connected successfully';
	
	// $sql = 'INSERT INTO ' .TABLE_NAME ."(name,email,opinion) VALUES('qq','admin@gmail.com','is great')";
	$sql = 'INSERT INTO '
			 .	TABLE_NAME 
			 .	"	(name, email, opinion) 
			 			VALUES
			 			("
			 				."'". $_POST['name'] 		."', "
			 				."'". $_POST['email'] 	."', "
			 				."'". $_POST['opinion'] ."'  "
			 .	 ");";

	echo '<br />'.$sql; 
	echo '<br />'.mysqli_error(); 
	
	echo '<br />Result: '. $result = mysqli_query($sql);
	echo '<br />'.mysqli_error(); 
	
	echo '<br />mysql_affected_rows(): '. $result = mysqli_affected_rows();
	echo '<br />'.mysqli_error(); 
	
	echo '<br />'.$sql = 'SELECT * FROM ' . TABLE_NAME .';' ;
	echo '<br />Result: ' .$result = mysqli_query($sql);
	
	if (!$result) {
	    die('Could not query table:' . mysqli_error());
	}
	
	while ($row = mysqli_fetch_object($result)) {
	    echo '<br />'			.$row->id;
	    echo ', &nbsp; '	.$row->name;
	    echo ', &nbsp; '	.$row->email;
	    echo ', &nbsp; '	.$row->opinion;
	}
	
	echo '<br />mysql_close(): '. mysqli_close($link);
	echo '<br />'.mysqli_error(); 
?>



