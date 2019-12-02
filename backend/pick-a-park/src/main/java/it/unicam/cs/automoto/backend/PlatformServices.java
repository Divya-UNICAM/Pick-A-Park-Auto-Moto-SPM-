package it.unicam.cs.automoto.backend;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

/**
 * Root resource (exposed at "api" path)
 */
@Path("api")
public class PlatformServices {

	@Path("Homepage{Token ID/value}") //Main page for web application
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Homepage() 
	{
		return "";
		//TODO		
	}

	@Path("Pay")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Pay() 
	{
		return ""; //Redirect
		//TODO		
	}
	
	@Path("Login{User type/string") //Different login access depending on the role selected
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Login() 
	{
		return "";
		//TODO		
	}
	
	@Path("request") //Parking request placed by drivers
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String Request() 
	{
		return "";
		//TODO		
	}
	
	@Path("Add") //Addition of Parking place and sensor IDs
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String Add() 
	{
		return "";
		//TODO		
	}
	
	@Path("Position{driver ID/location}") //Drivers current location tracking
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Position() 
	{
		return "";
		//TODO		
	}
	
	@Path("Notify{officerID/value}") //Notify police officers
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Notify() 
	{
		return "";
		//TODO		
	}
	
	@Path("Warn{driverID/value}") //Alert drivers regarding time lapse
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Warn() 
	{
		return "";
		//TODO		
	}
	
	@Path("Recieve{Sensor ID/value}") //Retrieving sensor data
	@GET
	public String Recieve() 
	{
		return "";
		//TODO		
	}
	
	@Path("officers{Officer ID/value}") //Retrieve officer data
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String officers() 
	{
		return "";
		//TODO		
	}
	
	@Path("Register") //Sign-up
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String Register() 
	{
		return "";
		//TODO		
	}
	
	@Path("Send") //Feedback from drivers on service provided
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public String Send() 
	{
		return "";
		//TODO		
	}
	
	@Path("Subscribe") //Subscription for any new explicit offers
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Subscribe() 
	{
		return "";
		//TODO		
	}
	
	@Path("Status") //Status of the system
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Status() 
	{
		return "";
		//TODO		
	}
	
}
