package de.example.prevbike;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.sql.Timestamp;


@Service
public class PostgisService {

    private final JdbcTemplate jdbcTemplate;
    private enum RequestMode {
        ALL, SAME_DAYTYPE, SAME_WEEKDAY
    }


    public PostgisService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void printLocations() {
        jdbcTemplate.query(
                "SELECT entryId, ST_AsText(location) AS location_text FROM bike_positions LIMIT 2",
                (rs, rowNum) -> {
                    Long id = rs.getLong("entryId");
                    String coordinates = rs.getString("location_text");
                    System.out.println("ID: " + id + ", Coordinates: " + coordinates);
                    return null;
                }
        );
    }

    public String getLocation() {
        return jdbcTemplate.queryForObject(
                "SELECT ST_AsText(location) AS location_text FROM bike_positions LIMIT 1",
                (rs, rowNum) -> rs.getString("location_text")
        );
    }

    // radius in meters; halfMinuteRange=30 => 60 total range
    private float getBikeProbability(RequestMode requestMode, float lat, float lon, float radius, Timestamp requestTimestamp, int weekRange, int halfMinuteRange) {

        LocalDate requestDate = requestTimestamp.toLocalDateTime().toLocalDate();
        LocalTime requestTime = requestTimestamp.toLocalDateTime().toLocalTime();

        LocalDate todayDate = LocalDate.now();  // todo: check if okay with timezone

        assert //todo requestTimestamp ist größer als aktuelle Zeit

        //"2024-08-02 23:12:00"
        // where location, hour range, day

        assert requestMode == RequestMode.SAME_WEEKDAY;
        String sql = """
            SELECT COUNT(DISTINCT timestamp) AS time_slot_count
            FROM bike_positions
            WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)
            AND timestamp::TIME BETWEEN (?::TIME - INTERVAL '? minutes')\s
                                    AND (?::TIME + INTERVAL '? minutes')
            AND timestamp BETWEEN (?::DATE - INTERVAL '? weeks')\s
                                AND (?::DATE - INTERVAL '1 day')
            AND EXTRACT(DOW FROM timestamp) = EXTRACT(DOW FROM ?::DATE);
        """;

        Integer time_slot_count = jdbcTemplate.queryForObject(sql,
                (rs, rowNum) -> rs.getInt("time_slot_count"),
                lon, lat, radius, requestTime, halfMinuteRange, requestTime, halfMinuteRange, todayDate, weekRange, todayDate, requestDate
        );
        if (time_slot_count == null) {
            time_slot_count = 0;
        }


        if (requestMode == RequestMode.SAME_WEEKDAY) {
            int days = weekRange+1;
        }
        int time_slots_per_day = 60



        switch (requestMode) {
            case ALL ->
        }
        int total_time_slot_count = // todo
        float probability = (float) time_slot_count / total_time_slot_count;
        return probability;
    }


}