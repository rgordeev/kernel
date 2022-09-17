package ru.amethyst.kernel.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Space.
 */
@Entity
@Table(name = "space")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Space implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "project_code")
    private String projectCode;

    @Column(name = "icon")
    private String icon;

    @ManyToOne
    private Organization organization;

    @ManyToOne
    private User owner;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Space id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Space title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProjectCode() {
        return this.projectCode;
    }

    public Space projectCode(String projectCode) {
        this.setProjectCode(projectCode);
        return this;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getIcon() {
        return this.icon;
    }

    public Space icon(String icon) {
        this.setIcon(icon);
        return this;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Space organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public User getOwner() {
        return this.owner;
    }

    public void setOwner(User user) {
        this.owner = user;
    }

    public Space owner(User user) {
        this.setOwner(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Space)) {
            return false;
        }
        return id != null && id.equals(((Space) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Space{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", projectCode='" + getProjectCode() + "'" +
            ", icon='" + getIcon() + "'" +
            "}";
    }
}
