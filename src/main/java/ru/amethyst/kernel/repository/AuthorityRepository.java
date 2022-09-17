package ru.amethyst.kernel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.amethyst.kernel.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
