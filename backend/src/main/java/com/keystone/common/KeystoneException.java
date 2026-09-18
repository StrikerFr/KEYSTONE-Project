package com.keystone.common;

public class KeystoneException extends RuntimeException {
    private final String errorCode;
    private final int status;

    public KeystoneException(String errorCode, String message, int status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
    public String getErrorCode() { return errorCode; }
    public int getStatus() { return status; }

    public static KeystoneException notFound(String entity, Object id) {
        return new KeystoneException(entity.toUpperCase() + "_NOT_FOUND",
            entity + " not found with id: " + id, 404);
    }
    public static KeystoneException conflict(String code, String message) {
        return new KeystoneException(code, message, 409);
    }
    public static KeystoneException badRequest(String code, String message) {
        return new KeystoneException(code, message, 422);
    }
    public static KeystoneException forbidden(String message) {
        return new KeystoneException("FORBIDDEN", message, 403);
    }
}