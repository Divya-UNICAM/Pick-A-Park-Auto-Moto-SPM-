<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Auto-Moto Registration Form</title>
</head>
<body>
<h1>Registration Form</h1>
<form action="request" method="post" onsubmit="return validation();">
			<table style="with: 50%">
				<tr>
					<td>Target Location:</td>
					<td><input type="text" name="targetLocation" id="targetLoc"/></td>
				</tr>
				<tr>
					<td>Starting Location:</td>
					<td><input type="text" name="startingLocation" id="startingLoc"/></td>
				</tr>
				<tr>
					<td>Date:</td>
					<td><input type="text" class="datepicker" id="date" value="text" style="border: none; background: none;" /></td>
				</tr>
					<tr>
					<td>Plate Number:</td>
					<td><input type="text" name="plateNumber" id="plateNumber" /></td>
				</tr>
				<tr>
					<td>Duration:</td>
					<td><input type="text" name="duration" id="duration" /></td>
				</tr>
				<tr>
	
				</tr></table>
			<input type="submit" name="submit" value="Book" /></form>
			
<script type="text/javascript">
function validation()
   {
	var targetLocation = document.getelementById('targetLoc').value;
	var startingLocation = document.getelementById('startingLoc').value;
	var date =document.getelementById('date').value;
	var plateNumber = document.getelementById('plateNumber').value;
	var duration = document.getelementById('duration').value;
	
	if(targetLocation=='')
		{
		doc
		return false;
		}
	else
		{
		return true;
		}
	
	}

</script>			
</body>
</html>