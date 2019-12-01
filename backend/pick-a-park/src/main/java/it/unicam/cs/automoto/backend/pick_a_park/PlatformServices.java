package it.unicam.cs.automoto.backend.pick_a_park;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("api")
public class PlatformServices {
	
	@Path("Management")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Management() 
	{
		return "";
		//TODO		
	}

	@Path("Pay")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Pay() 
	{
		return "";
		//TODO		
	}
	
	@Path("Login")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Login() 
	{
		return "";
		//TODO		
	}
	
	@Path("Request")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Request() 
	{
		return "";
		//TODO		
	}
	
	@Path("Add")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Add() 
	{
		return "";
		//TODO		
	}
	
	@Path("Position")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Position() 
	{
		return "";
		//TODO		
	}
	
	@Path("Notify")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Notify() 
	{
		return "";
		//TODO		
	}
	
	@Path("Recieve")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Recieve() 
	{
		return "";
		//TODO		
	}
	
	@Path("Register") //Sign-up
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Register() 
	{
		return "";
		//TODO		
	}
	
	@Path("Display") //Display the route
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Display() 
	{
		return "";
		//TODO		
	}
	
	@Path("Send") //Send Feedback
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Send() 
	{
		return "";
		//TODO		
	}
	
	@Path("Modify") //change parking place
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Modify() 
	{
		return "";
		//TODO		
	}
	
	@Path("Subscribe") 
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String Subscribe() 
	{
		return "";
		//TODO		
	}
	
}
