package com.keystone.asset;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public class AssetDto {
    public record Response(UUID id, UUID customerId, String customerName, String assetTag,
        String name, String type, String manufacturer, String model, String serialNumber,
        String location, AssetStatus status, LocalDate lastServiceDate,
        LocalDate nextMaintenanceDate, Instant createdAt) {}
    public record CreateRequest(UUID customerId, String assetTag, String name, String type,
        String manufacturer, String model, String serialNumber, String location,
        LocalDate installationDate, LocalDate nextMaintenanceDate) {}
    public record UpdateRequest(String name, AssetStatus status, LocalDate lastServiceDate, LocalDate nextMaintenanceDate) {}
}