package com.keystone.asset;
import com.keystone.common.KeystoneException;
import com.keystone.customer.Customer;
import com.keystone.customer.CustomerRepository;
import com.keystone.organization.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    private final CustomerRepository customerRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public Page<Asset> list(UUID orgId, Pageable pageable) {
        return assetRepository.findByOrganizationId(orgId, pageable);
    }

    @Transactional(readOnly = true)
    public Asset getById(UUID id, UUID orgId) {
        return assetRepository.findByIdAndOrganizationId(id, orgId)
            .orElseThrow(() -> KeystoneException.notFound("Asset", id));
    }

    @Transactional
    public Asset create(AssetDto.CreateRequest req, UUID orgId) {
        Customer customer = customerRepository.findById(req.customerId())
            .orElseThrow(() -> KeystoneException.notFound("Customer", req.customerId()));
        var org = organizationRepository.findById(orgId)
            .orElseThrow(() -> KeystoneException.notFound("Organization", orgId));
        return assetRepository.save(Asset.builder()
            .organization(org).customer(customer).assetTag(req.assetTag())
            .name(req.name()).type(req.type()).manufacturer(req.manufacturer())
            .model(req.model()).serialNumber(req.serialNumber()).location(req.location())
            .installationDate(req.installationDate()).nextMaintenanceDate(req.nextMaintenanceDate()).build());
    }

    @Transactional
    public Asset update(UUID id, AssetDto.UpdateRequest req, UUID orgId) {
        Asset a = getById(id, orgId);
        if (req.name() != null) a.setName(req.name());
        if (req.status() != null) a.setStatus(req.status());
        if (req.lastServiceDate() != null) a.setLastServiceDate(req.lastServiceDate());
        if (req.nextMaintenanceDate() != null) a.setNextMaintenanceDate(req.nextMaintenanceDate());
        return assetRepository.save(a);
    }

    public AssetDto.Response toDto(Asset a) {
        return new AssetDto.Response(a.getId(), a.getCustomer().getId(), a.getCustomer().getName(),
            a.getAssetTag(), a.getName(), a.getType(), a.getManufacturer(), a.getModel(),
            a.getSerialNumber(), a.getLocation(), a.getStatus(),
            a.getLastServiceDate(), a.getNextMaintenanceDate(), a.getCreatedAt());
    }
}