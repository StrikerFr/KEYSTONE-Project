package com.keystone.attachment;

import com.keystone.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> getAttachments(
            @RequestParam String entityType,
            @RequestParam UUID entityId
    ) {
        return ResponseEntity.ok(ApiResponse.success(attachmentService.getAttachments(entityType, entityId)));
    }
}