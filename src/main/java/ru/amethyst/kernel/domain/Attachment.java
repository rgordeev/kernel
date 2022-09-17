package ru.amethyst.kernel.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;

/**
 * A Attachment.
 */
@Entity
@Table(name = "attachment")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Attachment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "uuid")
    private UUID uuid;

    @Column(name = "uri")
    private String uri;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "length")
    private Long length;

    @ManyToOne
    private Organization organization;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "owner" }, allowSetters = true)
    private Space space;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organization", "space", "author" }, allowSetters = true)
    private Article article;

    @ManyToOne
    private User owner;

    @ManyToOne
    @JsonIgnoreProperties(value = { "article", "block", "author" }, allowSetters = true)
    private Comment comment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Attachment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getUuid() {
        return this.uuid;
    }

    public Attachment uuid(UUID uuid) {
        this.setUuid(uuid);
        return this;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getUri() {
        return this.uri;
    }

    public Attachment uri(String uri) {
        this.setUri(uri);
        return this;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getFileName() {
        return this.fileName;
    }

    public Attachment fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMimeType() {
        return this.mimeType;
    }

    public Attachment mimeType(String mimeType) {
        this.setMimeType(mimeType);
        return this;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getLength() {
        return this.length;
    }

    public Attachment length(Long length) {
        this.setLength(length);
        return this;
    }

    public void setLength(Long length) {
        this.length = length;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Attachment organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public Space getSpace() {
        return this.space;
    }

    public void setSpace(Space space) {
        this.space = space;
    }

    public Attachment space(Space space) {
        this.setSpace(space);
        return this;
    }

    public Article getArticle() {
        return this.article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Attachment article(Article article) {
        this.setArticle(article);
        return this;
    }

    public User getOwner() {
        return this.owner;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public Attachment owner(User user) {
        this.setOwner(user);
        return this;
    }

    public Comment getComment() {
        return this.comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Attachment comment(Comment comment) {
        this.setComment(comment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Attachment)) {
            return false;
        }
        return id != null && id.equals(((Attachment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Attachment{" +
            "id=" + getId() +
            ", uuid='" + getUuid() + "'" +
            ", uri='" + getUri() + "'" +
            ", fileName='" + getFileName() + "'" +
            ", mimeType='" + getMimeType() + "'" +
            ", length=" + getLength() +
            "}";
    }
}
