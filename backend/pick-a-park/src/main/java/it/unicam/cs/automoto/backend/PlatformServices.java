package it.unicam.cs.automoto.backend;
import it.unicam.cs.automoto.backend.*;
import it.unicam.cs.automoto.backend.model.Car;
import it.unicam.cs.automoto.backend.model.Location;
import it.unicam.cs.automoto.backend.model.ParkingPlace;
import it.unicam.cs.automoto.backend.model.Request;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.glassfish.grizzly.http.server.Response;

import static com.mongodb.client.model.Filters.*;
import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

/**
 * Root resource (exposed at "api" path)
 */
@Path("api")
public class PlatformServices {

	@Path("Homepage{Token ID/value}") //Main page for web application
	@GET
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_HTML)
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
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.TEXT_HTML)
	public String Request(@FormParam("targetLocation") String targetLoc, @FormParam("startingLocation") String startingLoc, @FormParam("duration") double duration, @FormParam("plateNumber") String plateNumber, @FormParam("date") String parkingDate) 
	{
		//A token gets generated for further authentication of the driver
		String token = UUID.randomUUID().toString();
		
		//Create the request object from post parameters
		Request req = null;
		try {
			Location targetLocation = new Location(targetLoc, "Camerino");
			Location startingLocation = new Location(startingLoc, "Rome");
			Car plateNmb = new Car(plateNumber);
			Date date = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").parse(parkingDate);
			req = new Request(targetLocation, startingLocation, duration, plateNmb, date);
		} catch (Exception e) {
			//Manage error in creating the request object
		}
		
		
		if (req == null)
			return "";
		
		MongoClient mongoClient = new MongoClient("localhost", 27017);
		//Check if location is registered
		//Retrieve locations from database
		//Check if location exists
		MongoDatabase database = mongoClient.getDatabase("locations");
		// in the database there is a collection for each parking place location
		// Camerino is a collection
		//documents in camerino can be le mosse -> 10 parking places
		//							   colle paradiso -> 20 parking places
		MongoCollection<Document> parkingPlaces = null;
		try {
			parkingPlaces = database.getCollection(req.getTargetLocation().toString());
		} catch (IllegalArgumentException e) {
			//handle the fact that the location doesnt exist
		}
		
		if(parkingPlaces == null)
			return "";
		//if location exists
		//check if there are available parking places
		if (parkingPlaces.countDocuments() == 0)
			return "";
		
		parkingPlaces.find(eq("geocord",req.getTargetLocation())).first();
		
		return "";
		
		
		
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
