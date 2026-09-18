package com.keystone.technician;
import com.keystone.common.KeystoneException;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import com.keystone.user.User;
import com.keystone.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class TechnicianService {
    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public Page<Technician> list(UUID orgId, Pageable pageable) {
        return technicianRepository.findByOrganizationId(orgId, pageable);
    }

    @Transactional(readOnly = true)
    public Technician getById(UUID id, UUID orgId) {
        return technicianRepository.findByIdAndOrganizationId(id, orgId)
            .orElseThrow(() -> KeystoneException.notFound("Technician", id));
    }

    @Transactional
    public Technician create(TechnicianDto.CreateRequest req, UUID orgId) {
        User user = userRepository.findById(req.userId())
            .orElseThrow(() -> KeystoneException.notFound("User", req.userId()));
        Organization org = organizationRepository.findById(orgId)
            .orElseThrow(() -> KeystoneException.notFound("Organization", orgId));
        if (technicianRepository.findByUserId(req.userId()).isPresent()) {
            throw KeystoneException.conflict("TECHNICIAN_ALREADY_EXISTS", "Technician profile already exists for this user.");
        }
        return technicianRepository.save(Technician.builder()
            .user(user).organization(org).specialization(req.specialization())
            .phone(req.phone()).skills(req.skills() != null ? req.skills() : java.util.List.of()).build());
    }

    @Transactional
    public Technician update(UUID id, TechnicianDto.UpdateRequest req, UUID orgId) {
        Technician t = getById(id, orgId);
        if (req.specialization() != null) t.setSpecialization(req.specialization());
        if (req.phone() != null) t.setPhone(req.phone());
        if (req.availabilityStatus() != null) t.setAvailabilityStatus(req.availabilityStatus());
        if (req.skills() != null) { t.getSkills().clear(); t.getSkills().addAll(req.skills()); }
        return technicianRepository.save(t);
    }

    public TechnicianDto.Response toDto(Technician t) {
        return new TechnicianDto.Response(t.getId(), t.getUser().getId(),
            t.getUser().getName(), t.getUser().getEmail(), t.getSpecialization(),
            t.getPhone(), t.getAvailabilityStatus(), t.getSlaScore(), t.getCompletedJobs(),
            0, t.getSkills(), t.getCreatedAt());
    }
}