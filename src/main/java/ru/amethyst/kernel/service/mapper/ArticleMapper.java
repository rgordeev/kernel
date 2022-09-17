package ru.amethyst.kernel.service.mapper;

import org.mapstruct.*;
import ru.amethyst.kernel.domain.Article;
import ru.amethyst.kernel.domain.Organization;
import ru.amethyst.kernel.domain.Space;
import ru.amethyst.kernel.domain.User;
import ru.amethyst.kernel.service.dto.ArticleDTO;
import ru.amethyst.kernel.service.dto.OrganizationDTO;
import ru.amethyst.kernel.service.dto.SpaceDTO;
import ru.amethyst.kernel.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Article} and its DTO {@link ArticleDTO}.
 */
@Mapper(componentModel = "spring")
public interface ArticleMapper extends EntityMapper<ArticleDTO, Article> {
    @Mapping(target = "organization", source = "organization", qualifiedByName = "organizationId")
    @Mapping(target = "space", source = "space", qualifiedByName = "spaceId")
    @Mapping(target = "author", source = "author", qualifiedByName = "userId")
    ArticleDTO toDto(Article s);

    @Named("organizationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrganizationDTO toDtoOrganizationId(Organization organization);

    @Named("spaceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SpaceDTO toDtoSpaceId(Space space);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
