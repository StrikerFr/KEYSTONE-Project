package com.keystone.customer;
import com.keystone.common.KeystoneException;
import com.keystone.organization.Organization;
import com.keystone.organization.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public Page<Customer> list(UUID orgId, String q, Pageable pageable) {
        if (q != null && !q.isBlank()) return customerRepository.searchByOrgId(orgId, q, pageable);
        return customerRepository.findByOrganizationId(orgId, pageable);
    }

    @Transactional(readOnly = true)
    public Customer getById(UUID id, UUID orgId) {
        return customerRepository.findByIdAndOrganizationId(id, orgId)
            .orElseThrow(() -> KeystoneException.notFound("Customer", id));
    }

    @Transactional
    public Customer create(CustomerDto.CreateRequest req, UUID orgId) {
        Organization org = organizationRepository.findById(orgId)
            .orElseThrow(() -> KeystoneException.notFound("Organization", orgId));
        return customerRepository.save(Customer.builder()
            .organization(org).name(req.name()).email(req.email())
            .phone(req.phone()).companyName(req.companyName()).build());
    }

    @Transactional
    public Customer update(UUID id, CustomerDto.UpdateRequest req, UUID orgId) {
        Customer c = getById(id, orgId);
        if (req.name() != null) c.setName(req.name());
        if (req.email() != null) c.setEmail(req.email());
        if (req.phone() != null) c.setPhone(req.phone());
        if (req.companyName() != null) c.setCompanyName(req.companyName());
        if (req.status() != null) c.setStatus(req.status());
        return customerRepository.save(c);
    }

    public CustomerDto.Response toDto(Customer c) {
        return new CustomerDto.Response(c.getId(), c.getOrganization().getId(),
            c.getName(), c.getEmail(), c.getPhone(), c.getCompanyName(), c.getStatus(),
            0, 0, c.getCreatedAt(), c.getUpdatedAt());
    }
}