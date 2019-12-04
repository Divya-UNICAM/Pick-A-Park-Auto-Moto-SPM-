package it.unicam.cs.automoto.backend.model;

public class Location {
	
	private String geocord;
	private String municipality;
	
	public Location(String location, String municipality) {
		//retrieve geocoordinates from google maps api
		this.geocord = location;
		this.municipality = municipality;
	}

	@Override
	public String toString() {
		return "Location [geocord=" + geocord + ", municipality=" + municipality + "]";
	}
	
	
	
	

}
