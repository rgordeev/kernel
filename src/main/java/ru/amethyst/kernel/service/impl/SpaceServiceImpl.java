package ru.amethyst.kernel.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.amethyst.kernel.domain.Space;
import ru.amethyst.kernel.repository.SpaceRepository;
import ru.amethyst.kernel.service.SpaceService;
import ru.amethyst.kernel.service.dto.SpaceDTO;
import ru.amethyst.kernel.service.mapper.SpaceMapper;

/**
 * Service Implementation for managing {@link Space}.
 */
@Service
@Transactional
public class SpaceServiceImpl implements SpaceService {

    private final Logger log = LoggerFactory.getLogger(SpaceServiceImpl.class);

    private final SpaceRepository spaceRepository;

    private final SpaceMapper spaceMapper;

    public SpaceServiceImpl(SpaceRepository spaceRepository, SpaceMapper spaceMapper) {
        this.spaceRepository = spaceRepository;
        this.spaceMapper = spaceMapper;
    }

    @Override
    public SpaceDTO save(SpaceDTO spaceDTO) {
        log.debug("Request to save Space : {}", spaceDTO);
        Space space = spaceMapper.toEntity(spaceDTO);
        space = spaceRepository.save(space);
        return spaceMapper.toDto(space);
    }

    @Override
    public SpaceDTO update(SpaceDTO spaceDTO) {
        log.debug("Request to update Space : {}", spaceDTO);
        Space space = spaceMapper.toEntity(spaceDTO);
        space = spaceRepository.save(space);
        return spaceMapper.toDto(space);
    }

    @Override
    public Optional<SpaceDTO> partialUpdate(SpaceDTO spaceDTO) {
        log.debug("Request to partially update Space : {}", spaceDTO);

        return spaceRepository
            .findById(spaceDTO.getId())
            .map(existingSpace -> {
                spaceMapper.partialUpdate(existingSpace, spaceDTO);

                return existingSpace;
            })
            .map(spaceRepository::save)
            .map(spaceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpaceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Spaces");
        return spaceRepository.findAll(pageable).map(spaceMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SpaceDTO> findOne(Long id) {
        log.debug("Request to get Space : {}", id);
        return spaceRepository.findById(id).map(spaceMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Space : {}", id);
        spaceRepository.deleteById(id);
    }
}
