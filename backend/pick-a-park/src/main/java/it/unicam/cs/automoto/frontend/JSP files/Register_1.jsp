<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Auto-Moto Registration Form</title>
</head>
<body>
<h1>Registeration Form</h1>
<form action="api" method="post">
			<table style="with: 50%">
				<tr>
					<td>Target Location:</td>
					<td><input type="text" name="targetLocation" /></td>
				</tr>
				<tr>
					<td>Starting Location:</td>
					<td><input type="text" name="startingLocation" /></td>
				</tr>
				<tr>
					<td>Date:</td>
					<td><input type="text" class="datepicker" value="" style="border: none; background: none;" /></td>
				</tr>
					<tr>
					<td>Plate Number:</td>
					<td><input type="text" name="plateNumber" /></td>
				</tr>
				<tr>
					<td>Duration:</td>
					<td><input type="text" name="duration" /></td>
				</tr>
				<tr>
	
				</tr></table>
			<input type="submit" value="Submit" /></form>
</body>
</html>