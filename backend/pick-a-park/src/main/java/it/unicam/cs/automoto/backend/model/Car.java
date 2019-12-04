package it.unicam.cs.automoto.backend.model;

public class Car {
	
	private String plateNumber;
	
	public Car(String plateNumber) {
		this.plateNumber = plateNumber;
	}

	@Override
	public String toString() {
		return "Car [plateNumber=" + plateNumber + "]";
	}

}
