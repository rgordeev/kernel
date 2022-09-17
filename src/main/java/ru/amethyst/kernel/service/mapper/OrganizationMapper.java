package ru.amethyst.kernel.service.mapper;

import org.mapstruct.*;
import ru.amethyst.kernel.domain.Organization;
import ru.amethyst.kernel.service.dto.OrganizationDTO;

/**
 * Mapper for the entity {@link Organization} and its DTO {@link OrganizationDTO}.
 */
@Mapper(componentModel = "spring")
public interface OrganizationMapper extends EntityMapper<OrganizationDTO, Organization> {}
