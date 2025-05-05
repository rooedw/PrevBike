package de.example.prevbike;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import de.example.prevbike.PostgisService.RequestMode;

@RestController
@RequestMapping("/bikeapi")
public class BikeController {
    private static final float MAX_RADIUS = 5000f;
    private static final int MAX_WEEK_RANGE = 520;
    private static final int MAX_HALF_MINUTE_RANGE = 720;


    private final PostgisService postgisService;

    public BikeController(PostgisService postgisService) {
        this.postgisService = postgisService;
    }

    @GetMapping("/num")
    public int getAnswer() {
        return 43;
    }

    @GetMapping("/probability_test")
    public float getBikeProbabilityTest() {
        float lat = 49.011223016021454F;
        float lon = 8.416850309144804F;
        Timestamp futureTimestamp = Timestamp.valueOf(LocalDateTime.now().plusDays(7).plusHours(1));

        return postgisService.getBikeProbability(PostgisService.RequestMode.SAME_WEEKDAY, lat, lon, 200f, futureTimestamp, 3, 30);
    }

    // probability?lat=49.011223016021454&lon=8.416850309144804&radius=500.0&weekRange=5&halfMinuteRange=30&requestModeString=ALL&requestTimestampString=2025-03-15T16:20:00
    @CrossOrigin
    @GetMapping("/probability")
    public float getBikeProbability(@RequestParam float lat,
                                    @RequestParam float lon,
                                    @RequestParam float radius,
                                    @RequestParam int weekRange,
                                    @RequestParam int halfMinuteRange,
                                    @RequestParam String requestModeString,
                                    @RequestParam String requestTimestampString) {
        System.out.println("Requested parameters (without lat/lon): " + radius + ", " + weekRange + ", " + halfMinuteRange + ", " + requestModeString + ", " + requestTimestampString);

        if (lat > 90f || lat < -90f || lon > 180f || lon < -180f) throw new InvalidParameterException("Illegal coordinates");
        if (radius < 0 || radius > MAX_RADIUS) throw new InvalidParameterException("Illegal radius");
        if (weekRange <= 0 || weekRange > MAX_WEEK_RANGE) throw new InvalidParameterException("Illegal week range");
        if (halfMinuteRange <= 0 || halfMinuteRange > MAX_HALF_MINUTE_RANGE) throw new InvalidParameterException("Illegal half minute range");

        RequestMode requestMode;
        try {
            requestMode = RequestMode.valueOf(requestModeString);
        } catch (IllegalArgumentException e) {
            throw new InvalidParameterException("Illegal request mode");
        }

        Timestamp requestTimestamp;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            requestTimestamp = Timestamp.valueOf(LocalDateTime.parse(requestTimestampString, formatter));
        } catch (DateTimeParseException e) {
            throw new InvalidParameterException("Illegal requestTimestamp format. Use: yyyy-MM-dd'T'HH:mm:ss");
        }

        return postgisService.getBikeProbability(requestMode, lat, lon, radius, requestTimestamp, weekRange, halfMinuteRange);
    }
}