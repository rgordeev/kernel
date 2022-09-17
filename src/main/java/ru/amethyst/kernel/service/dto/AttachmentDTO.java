package ru.amethyst.kernel.service.dto;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * A DTO for the {@link ru.amethyst.kernel.domain.Attachment} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AttachmentDTO implements Serializable {

    private Long id;

    private UUID uuid;

    private String uri;

    private String fileName;

    private String mimeType;

    private Long length;

    private OrganizationDTO organization;

    private SpaceDTO space;

    private ArticleDTO article;

    private UserDTO owner;

    private CommentDTO comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getLength() {
        return length;
    }

    public void setLength(Long length) {
        this.length = length;
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

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public CommentDTO getComment() {
        return comment;
    }

    public void setComment(CommentDTO comment) {
        this.comment = comment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AttachmentDTO)) {
            return false;
        }

        AttachmentDTO attachmentDTO = (AttachmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, attachmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AttachmentDTO{" +
            "id=" + getId() +
            ", uuid='" + getUuid() + "'" +
            ", uri='" + getUri() + "'" +
            ", fileName='" + getFileName() + "'" +
            ", mimeType='" + getMimeType() + "'" +
            ", length=" + getLength() +
            ", organization=" + getOrganization() +
            ", space=" + getSpace() +
            ", article=" + getArticle() +
            ", owner=" + getOwner() +
            ", comment=" + getComment() +
            "}";
    }
}
