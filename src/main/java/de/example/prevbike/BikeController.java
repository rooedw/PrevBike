package de.example.prevbike;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/bikeapi")
public class BikeController {

    private final PostgisService postgisService;

    public BikeController(PostgisService postgisService) {
        this.postgisService = postgisService;
    }

    @GetMapping("/num")
    public int getAnswer() {
        return 42;
    }

    @GetMapping("/greet")
    public String greet(@RequestParam String name,
                        @RequestParam int age,
                        @RequestParam String city) {
        return "Hello, " + name + ". You are " + age + " years old and live in " + city + ".";
    }

    @GetMapping("/postgis")
    public int doPostgis() {
        postgisService.printLocations();
        return 0;
    }

    @GetMapping("/probability")
    public float getBikeProbability() {
        float lat = 49.011223016021454F;
        float lon = 88.416850309144804F;
        Timestamp futureTimestamp = Timestamp.valueOf(LocalDateTime.now().plusDays(7).plusHours(1));
        return postgisService.getBikeProbability(PostgisService.RequestMode.SAME_WEEKDAY, lat, lon, 200f, futureTimestamp, 3, 30);

        /*
        * @RequestParam float lat,
                                  @RequestParam float lon,
                                  @RequestParam float radius
        * */
    }
}