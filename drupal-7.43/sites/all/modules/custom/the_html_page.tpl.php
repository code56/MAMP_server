<?php
print ("hello");
function query_sql_db()

{
  echo("hello");
  $servername = "localhost";
  $username = "root";
  $password = "root";
  $dbname = "expvip_related";

  // Create connection
  $conn = mysqli_connect($servername, $username, $password, $dbname);
  // Check connection
  if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
  }

  //$sql = "SELECT id, name, gene FROM genes";
  $sql = "SELECT name FROM gene_sets";
  $result = mysqli_query($conn, $sql);
  $rows = array();

  // somewhere here I will result cache my SQL results
  // I need to limit the fetching of results to 20 rows 

  if (mysqli_num_rows($result) > 0) {
      // output data of each row
      while($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
       
        
        //return json_encode($rows);
      }
      print json_encode($rows);
      return json_encode($rows);
      /*echo "
              <script type=\"text/javascript\">
                var e = <?php Print($rows); ?>;
                console.log(\"hello\");
              </script>
          ";
        print json_encode($rows);*/
       // this prints [{"name":"IWGSC2.26"}] //for the autcomplete I need something like this  { label: "Wheat" },
      
       // $data = json_encode($result, JSON_PRETTY_PRINT);
       // echo ($data);
      //  echo json_encode(("name: " . $row["name"]), JSON_PRETTY_PRINT). "<br>";
  //         echo "id: " . $row["id"]. " - Name: " . $row["name"]. " " . $row["gene"]. "<br>";

    //  }
  } else {
      echo "0 results";
  }
  mysqli_close($conn);
}

?>
