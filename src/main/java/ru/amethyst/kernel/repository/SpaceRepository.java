package ru.amethyst.kernel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.amethyst.kernel.domain.Space;

/**
 * Spring Data JPA repository for the Space entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {
    @Query("select space from Space space where space.owner.login = ?#{principal.preferredUsername}")
    List<Space> findByOwnerIsCurrentUser();
}
