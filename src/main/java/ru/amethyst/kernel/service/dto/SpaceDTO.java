package ru.amethyst.kernel.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link ru.amethyst.kernel.domain.Space} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SpaceDTO implements Serializable {

    private Long id;

    private String title;

    private String projectCode;

    private String icon;

    private OrganizationDTO organization;

    private UserDTO owner;

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

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public OrganizationDTO getOrganization() {
        return organization;
    }

    public void setOrganization(OrganizationDTO organization) {
        this.organization = organization;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SpaceDTO)) {
            return false;
        }

        SpaceDTO spaceDTO = (SpaceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, spaceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SpaceDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", projectCode='" + getProjectCode() + "'" +
            ", icon='" + getIcon() + "'" +
            ", organization=" + getOrganization() +
            ", owner=" + getOwner() +
            "}";
    }
}
