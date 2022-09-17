package ru.amethyst.kernel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.amethyst.kernel.domain.Attachment;

/**
 * Spring Data JPA repository for the Attachment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    @Query("select attachment from Attachment attachment where attachment.owner.login = ?#{principal.preferredUsername}")
    List<Attachment> findByOwnerIsCurrentUser();
}
