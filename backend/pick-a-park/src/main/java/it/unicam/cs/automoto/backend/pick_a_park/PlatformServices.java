package it.unicam.cs.automoto.backend.pick_a_park;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("api")
public class PlatformServices {
	
	@Path("hello")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String hello() {
		return "{ 'hello':'world' }";
	}

}
