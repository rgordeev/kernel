package ru.amethyst.kernel.service.mapper;

import org.mapstruct.*;
import ru.amethyst.kernel.domain.Organization;
import ru.amethyst.kernel.domain.Space;
import ru.amethyst.kernel.domain.User;
import ru.amethyst.kernel.service.dto.OrganizationDTO;
import ru.amethyst.kernel.service.dto.SpaceDTO;
import ru.amethyst.kernel.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Space} and its DTO {@link SpaceDTO}.
 */
@Mapper(componentModel = "spring")
public interface SpaceMapper extends EntityMapper<SpaceDTO, Space> {
    @Mapping(target = "organization", source = "organization", qualifiedByName = "organizationId")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "userId")
    SpaceDTO toDto(Space s);

    @Named("organizationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrganizationDTO toDtoOrganizationId(Organization organization);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
