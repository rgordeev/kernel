package ru.amethyst.kernel.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.amethyst.kernel.service.dto.SpaceDTO;

/**
 * Service Interface for managing {@link ru.amethyst.kernel.domain.Space}.
 */
public interface SpaceService {
    /**
     * Save a space.
     *
     * @param spaceDTO the entity to save.
     * @return the persisted entity.
     */
    SpaceDTO save(SpaceDTO spaceDTO);

    /**
     * Updates a space.
     *
     * @param spaceDTO the entity to update.
     * @return the persisted entity.
     */
    SpaceDTO update(SpaceDTO spaceDTO);

    /**
     * Partially updates a space.
     *
     * @param spaceDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SpaceDTO> partialUpdate(SpaceDTO spaceDTO);

    /**
     * Get all the spaces.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SpaceDTO> findAll(Pageable pageable);

    /**
     * Get the "id" space.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SpaceDTO> findOne(Long id);

    /**
     * Delete the "id" space.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
