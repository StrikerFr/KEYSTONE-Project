package com.keystone.common;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import java.time.Instant;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PagedResponse<T> {
    private final boolean success = true;
    private final List<T> data;
    private final PaginationMeta pagination;
    private final String timestamp = Instant.now().toString();

    public PagedResponse(List<T> data, long totalElements, int page, int size) {
        this.data = data;
        int totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        this.pagination = new PaginationMeta(page, size, totalElements, totalPages);
    }
    public record PaginationMeta(int page, int size, long totalElements, int totalPages) {}
}