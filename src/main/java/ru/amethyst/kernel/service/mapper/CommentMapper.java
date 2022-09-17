package ru.amethyst.kernel.service.mapper;

import org.mapstruct.*;
import ru.amethyst.kernel.domain.Article;
import ru.amethyst.kernel.domain.Block;
import ru.amethyst.kernel.domain.Comment;
import ru.amethyst.kernel.domain.User;
import ru.amethyst.kernel.service.dto.ArticleDTO;
import ru.amethyst.kernel.service.dto.BlockDTO;
import ru.amethyst.kernel.service.dto.CommentDTO;
import ru.amethyst.kernel.service.dto.UserDTO;

/**
 * Mapper for the entity {@link Comment} and its DTO {@link CommentDTO}.
 */
@Mapper(componentModel = "spring")
public interface CommentMapper extends EntityMapper<CommentDTO, Comment> {
    @Mapping(target = "article", source = "article", qualifiedByName = "articleId")
    @Mapping(target = "block", source = "block", qualifiedByName = "blockId")
    @Mapping(target = "author", source = "author", qualifiedByName = "userId")
    CommentDTO toDto(Comment s);

    @Named("articleId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ArticleDTO toDtoArticleId(Article article);

    @Named("blockId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    BlockDTO toDtoBlockId(Block block);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
