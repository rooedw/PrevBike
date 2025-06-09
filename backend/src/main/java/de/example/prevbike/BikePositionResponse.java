package de.example.prevbike;

import java.util.List;

public class BikePositionResponse {
    private List<Double> lat;
    private List<Double> lon;

    public BikePositionResponse(List<Double> lat, List<Double> lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public List<Double> getLat() { return lat; }
    public List<Double> getLon() { return lon; }
}
