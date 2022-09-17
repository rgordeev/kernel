package ru.amethyst.kernel.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.amethyst.kernel.domain.Organization;

/**
 * Spring Data JPA repository for the Organization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {}
