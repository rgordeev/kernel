package ru.amethyst.kernel.service.dto;

import java.io.Serializable;
import java.util.Objects;
import ru.amethyst.kernel.domain.enumeration.BlockType;

/**
 * A DTO for the {@link ru.amethyst.kernel.domain.Block} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BlockDTO implements Serializable {

    private Long id;

    private BlockType type;

    private Integer order;

    private String payload;

    private OrganizationDTO organization;

    private SpaceDTO space;

    private ArticleDTO article;

    private UserDTO author;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BlockType getType() {
        return type;
    }

    public void setType(BlockType type) {
        this.type = type;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public OrganizationDTO getOrganization() {
        return organization;
    }

    public void setOrganization(OrganizationDTO organization) {
        this.organization = organization;
    }

    public SpaceDTO getSpace() {
        return space;
    }

    public void setSpace(SpaceDTO space) {
        this.space = space;
    }

    public ArticleDTO getArticle() {
        return article;
    }

    public void setArticle(ArticleDTO article) {
        this.article = article;
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
        if (!(o instanceof BlockDTO)) {
            return false;
        }

        BlockDTO blockDTO = (BlockDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, blockDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BlockDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", order=" + getOrder() +
            ", payload='" + getPayload() + "'" +
            ", organization=" + getOrganization() +
            ", space=" + getSpace() +
            ", article=" + getArticle() +
            ", author=" + getAuthor() +
            "}";
    }
}
