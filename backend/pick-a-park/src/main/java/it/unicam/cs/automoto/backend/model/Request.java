package it.unicam.cs.automoto.backend.model;

import java.util.Date;

public class Request {
	
	private Location targetLocation;
	private Location startingLocation;
	private double duration;
	private Car plateNumber;
	private Date date;
	
	public Request(Location targetLocation, Location startingLocation, double duration, Car plateNumber, Date date) {
		super();
		this.targetLocation = targetLocation;
		this.startingLocation = startingLocation;
		this.duration = duration;
		this.plateNumber = plateNumber;
		this.date = date;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public Location getTargetLocation() {
		return targetLocation;
	}
	public void setTargetLocation(Location targetLocation) {
		this.targetLocation = targetLocation;
	}
	public Location getStartingLocation() {
		return startingLocation;
	}
	public void setStartingLocation(Location startingLocation) {
		this.startingLocation = startingLocation;
	}
	public double getDuration() {
		return duration;
	}
	public void setDuration(double duration) {
		this.duration = duration;
	}
	public Car getPlateNumber() {
		return plateNumber;
	}
	public void setPlateNumber(Car plateNumber) {
		this.plateNumber = plateNumber;
	}
	
	
	
	

}
