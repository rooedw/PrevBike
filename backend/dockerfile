# Nutze den offiziellen OpenJDK-17-Image
FROM openjdk:23-jdk-slim

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere das JAR-File (erstellt mit Gradle)
#COPY build/libs/PrevBike-0.0.1-SNAPSHOT.jar app.jar

# Starte die Anwendung
ENTRYPOINT ["java", "-jar", "PrevBike-0.0.1-SNAPSHOT.jar"]
