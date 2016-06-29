<?php

	include "conn.php";

	$db = new mysql('127.0.0.1','root','','acaciahkjx','utf8');
	// echo $db->query;
	$type = $_GET['type'];
	$res;
	
	function getCommon(){
		$i=0;
		$query = mysql_query("select * from h_activity_area where 1");
		// $query = $db->query("select * from h_activity_area where 1");
		while($row = mysql_fetch_array($query)){
		// while($row = $db->fn_fetch_array('h_activity_area','*')){
			$rs[$i] = array("id" =>$row['townid'],"name" =>$row['cndesc']);
			$i++;
		}
		return $rs;
	}
	
	function findUser(){
		$i=0;
		$name = $_GET['name'];
		$townid = $_GET['townid'];
		$query = mysql_query("select * from h_user where name='".$name."' and is_effect=1");
		while($row = mysql_fetch_array($query)){
		//while($row = $db->fn_fetch_array('h_user','*','and is_effect=1')){
			$rs[$i] = $row;
			$i++;
		}
		return $rs;
	}
	switch($type){
		case 'commonInfo':
			$res = getCommon();
			break;
		case 'findUser':
			$res = findUser();
			break;
		default:
			$res = '';
			break;
		
	}
	// $res = $db->fn_insert('h_user','name,sex,townid,create_date',$_GET('name').",".$_GET('sex').",".$_GET('townid').",".now());
	// $db->fn_insert('h_activity_area','name,cndesc,townid',"'guanyang','灌阳','7'");
	// $db->fn_insert('h_activity_area','name,cndesc,townid',"'wuxuan','武宣','8'");
	echo json_encode($res);
	// echo $res;
	$db->close();
?>