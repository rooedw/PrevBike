package de.example.prevbike;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bikeapi")
public class BikeController {
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
}
