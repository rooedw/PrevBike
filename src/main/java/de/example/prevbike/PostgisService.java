package de.example.prevbike;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.sql.Timestamp;


@Service
public class PostgisService {

    private final JdbcTemplate jdbcTemplate;
    public enum RequestMode {
        ALL, SAME_DAY_TYPE, SAME_WEEKDAY
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
    public float getBikeProbability(RequestMode requestMode, float lat, float lon, float radius, Timestamp requestTimestamp, int weekRange, int halfMinuteRange) {

        assert requestTimestamp.after(new Timestamp(System.currentTimeMillis()))
                : "requestTimestamp must be in the future!";

        // count time slots in which at least one bike was available
        String sql_available_bikes = """
            SELECT COUNT(DISTINCT timestamp) AS time_slot_count
            FROM bike_positions
            WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?) AND
        """;

        String timeSelectionString = timeQueryBuilder(requestMode, requestTimestamp, weekRange, halfMinuteRange);
        sql_available_bikes += timeSelectionString + ";";

        Integer time_slot_count = jdbcTemplate.queryForObject(sql_available_bikes,
                (rs, rowNum) -> rs.getInt("time_slot_count"),
                lon, lat, radius);
        if (time_slot_count == null) time_slot_count = 0;


        // count fetches of bike api in selected time period
        String sql_fetch_times = """
            SELECT COUNT(DISTINCT timestamp) AS fetch_time_count
            FROM bike_timestamps WHERE
        """;
        sql_fetch_times += timeSelectionString + ";";

        Integer fetch_time_count = jdbcTemplate.queryForObject(sql_fetch_times,
                (rs, rowNum) -> rs.getInt("fetch_time_count"));
        if (fetch_time_count == null) fetch_time_count = 0;

        if (fetch_time_count == 0) return -1f;  // todo: return error

        float probability = (float) time_slot_count / fetch_time_count;
        return probability;
    }


    private String timeQueryBuilder(RequestMode requestMode, Timestamp requestTimestamp, int weekRange, int halfMinuteRange) {
        LocalDate requestDate = requestTimestamp.toLocalDateTime().toLocalDate();
        LocalTime requestTime = requestTimestamp.toLocalDateTime().toLocalTime();
        LocalDate todayDate = LocalDate.now();  // todo: check if okay with timezone

        // between [start, end)
        String sql = String.format("""
             timestamp::TIME BETWEEN ('%s'::TIME - INTERVAL '%s minutes')
                                    AND ('%s'::TIME + INTERVAL '%s minutes')
            AND timestamp BETWEEN ('%s'::DATE - INTERVAL '%s weeks')
                                    AND ('%s'::DATE)
            """,
                requestTime, halfMinuteRange, requestTime, halfMinuteRange, todayDate, weekRange, todayDate);
        if (requestMode == RequestMode.SAME_WEEKDAY) {
            sql += String.format(" AND EXTRACT(DOW FROM timestamp) = EXTRACT(DOW FROM '%s'::DATE)", requestDate);
        } else if (requestMode == RequestMode.SAME_DAY_TYPE) {
            DayOfWeek requestDayOfWeek = requestDate.getDayOfWeek();
            String range = (requestDayOfWeek == DayOfWeek.SATURDAY || requestDayOfWeek == DayOfWeek.SUNDAY) ? "(0, 6)" : "(1, 2, 3, 4, 5)";
            sql += " AND EXTRACT(DOW FROM timestamp) IN " + range;
        }
        // requestMode == RequestMode.ALL  --> nop

        return sql;
    }

}