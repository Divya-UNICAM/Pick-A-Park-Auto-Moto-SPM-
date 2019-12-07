<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Auto-Moto Login Page</title>
</head>
<body>
<h1>Login</h1>
<form action="Login" method="post">

<table style="with: 50%">
 
			<form:form  commandName="login"	method="post">
						<fieldset>

							<div  title="Username">
								<span ><i></i></span>
								<form:input  name="username"
									id="username" type="text" placeholder="type username" path="username" />
								<form:errors path="username" cssStyle="color: #ff0000;"/>
									
							</div>
							<div ></div>

							<div  title="Password">
								<span><i></i></span>
								<form:input name="password"
									id="password" type="password" placeholder="type password" path="password" />
								<form:errors path="password" cssStyle="color: #ff0000;"/>
							</div>
							<div title="Select">
								<form:select id="userType" path="userType">
									<option>Municipality</option>
									<option>Police Officer</option>
									<option>Admin</option>
									
								</form:select>
							<button type="submit">Login</button>
							</div>
							<div ></div>
						</fieldset>
					</form:form>


</body>
</html>