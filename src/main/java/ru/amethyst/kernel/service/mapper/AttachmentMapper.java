package ru.amethyst.kernel.service.mapper;

import org.mapstruct.*;
import ru.amethyst.kernel.domain.Article;
import ru.amethyst.kernel.domain.Attachment;
import ru.amethyst.kernel.domain.Comment;
import ru.amethyst.kernel.domain.Organization;
import ru.amethyst.kernel.domain.Space;
import ru.amethyst.kernel.domain.User;
import ru.amethyst.kernel.service.dto.ArticleDTO;
import ru.amethyst.kernel.service.dto.AttachmentDTO;
import ru.amethyst.kernel.service.dto.CommentDTO;
import ru.amethyst.kernel.service.dto.OrganizationDTO;
import ru.amethyst.kernel.service.dto.SpaceDTO;
import ru.amethyst.kernel.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Attachment} and its DTO {@link AttachmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface AttachmentMapper extends EntityMapper<AttachmentDTO, Attachment> {
    @Mapping(target = "organization", source = "organization", qualifiedByName = "organizationId")
    @Mapping(target = "space", source = "space", qualifiedByName = "spaceId")
    @Mapping(target = "article", source = "article", qualifiedByName = "articleId")
    @Mapping(target = "owner", source = "owner", qualifiedByName = "userId")
    @Mapping(target = "comment", source = "comment", qualifiedByName = "commentId")
    AttachmentDTO toDto(Attachment s);

    @Named("organizationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    OrganizationDTO toDtoOrganizationId(Organization organization);

    @Named("spaceId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SpaceDTO toDtoSpaceId(Space space);

    @Named("articleId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ArticleDTO toDtoArticleId(Article article);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("commentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CommentDTO toDtoCommentId(Comment comment);
}
