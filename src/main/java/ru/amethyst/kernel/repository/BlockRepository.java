package ru.amethyst.kernel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.amethyst.kernel.domain.Block;

/**
 * Spring Data JPA repository for the Block entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    @Query("select block from Block block where block.author.login = ?#{principal.preferredUsername}")
    List<Block> findByAuthorIsCurrentUser();
}
