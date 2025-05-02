import jakarta.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @PostConstruct
    public void logInit() {
        System.out.println("CORS config initialized 42");  // Log to confirm it's being loaded
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // ⚠ Allows all origins — for testing only!
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        System.out.println("43 --- 43 --- 43 --- 43 --- 43 --- 43 --- 43 --- 43 --- 43 --- 43 --- 43 --- ");
    }
}
