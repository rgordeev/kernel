package ru.amethyst.kernel.service.dto;

import java.io.Serializable;
import java.util.Objects;
import ru.amethyst.kernel.domain.enumeration.ArticleStatus;

/**
 * A DTO for the {@link ru.amethyst.kernel.domain.Article} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ArticleDTO implements Serializable {

    private Long id;

    private String title;

    private ArticleStatus status;

    private OrganizationDTO organization;

    private SpaceDTO space;

    private UserDTO author;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ArticleStatus getStatus() {
        return status;
    }

    public void setStatus(ArticleStatus status) {
        this.status = status;
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
        if (!(o instanceof ArticleDTO)) {
            return false;
        }

        ArticleDTO articleDTO = (ArticleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, articleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ArticleDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", status='" + getStatus() + "'" +
            ", organization=" + getOrganization() +
            ", space=" + getSpace() +
            ", author=" + getAuthor() +
            "}";
    }
}
