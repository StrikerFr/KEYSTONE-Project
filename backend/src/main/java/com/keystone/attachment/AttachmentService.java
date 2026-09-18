package com.keystone.attachment;

import com.keystone.security.KeystonePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    @Transactional(readOnly = true)
    public List<AttachmentDto> getAttachments(String entityType, UUID entityId) {
        return attachmentRepository.findByEntityTypeAndEntityId(entityType, entityId).stream()
                .map(a -> AttachmentDto.builder()
                        .id(a.getId())
                        .entityType(a.getEntityType())
                        .entityId(a.getEntityId())
                        .fileName(a.getFileName())
                        .fileUrl(a.getFileUrl())
                        .fileType(a.getFileType())
                        .fileSize(a.getFileSize())
                        .createdAt(a.getCreatedAt())
                        .build())
                .toList();
    }
}