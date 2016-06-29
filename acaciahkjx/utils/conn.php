
<?php 
	class mysql{
		private $host;
		private $name;
		private $pass;
		private $talbe;
		private $ut;

		function __construct($host,$name,$pass,$table,$ut){
			$this->host = $host;
			$this->name = $name;
			$this->pass = $pass;
			$this->table = $table;
			$this->ut = $ut;
			$this->connect();

		}

		function connect(){
			$conn = mysql_connect($this->host,$this->name,$this->pass) or die (mysql_error());
			mysql_select_db($this->table,$conn) or die("没有该库".$this->table);
			mysql_query("SET NAMES '$this->ut'");
		}

		function query($v){
			return mysql_query($v);
		}

		function show($message="",$sql=""){
			if(!$sql) echo $message;
			else echo $message."<br>".$sql;
		}

		function affected_rows(){
			return mysql_affected_rows();
		}

		function result($query,$row){
			return mysql_result($query,$row);
		}

		function num_rows($query){
			return mysql_num_rows($query);
		}

		function num_fields($query){
			return mysql_num_fields($query);
		}

		function free_result($query){
			return mysql_free_result($query);
		}

		function insert_id(){
			return mysql_insert_id();
		}

		function fetch_row($query){
			return mysql_fetch_row($query);
		}
		
		function fetch_array($query){
			return mysql_fetch_array($query);
		}

		function version(){
			return mysql_get_server_info();
		}

		function close(){
			return mysql_close();
		}

		function fn_insert($table,$name,$value){
			$this->query("insert into $table ($name) values ($value)");
		}
		function fn_fetch_array($table,$name){
			// $where = $where || '1';
			$query = $this->query("select $name from $table where 1 ");
			$row = $this->fetch_array($query);
			return $row;
		}
	}
?> 