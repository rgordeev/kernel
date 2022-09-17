package ru.amethyst.kernel.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link ru.amethyst.kernel.domain.Comment} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CommentDTO implements Serializable {

    private Long id;

    private String text;

    private ArticleDTO article;

    private BlockDTO block;

    private UserDTO author;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public ArticleDTO getArticle() {
        return article;
    }

    public void setArticle(ArticleDTO article) {
        this.article = article;
    }

    public BlockDTO getBlock() {
        return block;
    }

    public void setBlock(BlockDTO block) {
        this.block = block;
    }

    public UserDTO getAuthor() {
        return author;
    }

    public void setAuthor(UserDTO author) {
        this.author = author;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CommentDTO)) {
            return false;
        }

        CommentDTO commentDTO = (CommentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, commentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CommentDTO{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", article=" + getArticle() +
            ", block=" + getBlock() +
            ", author=" + getAuthor() +
            "}";
    }
}
