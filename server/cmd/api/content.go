package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"
)

type portfolio struct {
	Profile struct {
		Name            string `json:"name"`
		Title           string `json:"title"`
		Location        string `json:"location"`
		CareerStartYear int    `json:"careerStartYear"`
		Summary         string `json:"summary"`
		Links           struct {
			Email    string `json:"email"`
			LinkedIn string `json:"linkedin"`
			Resume   string `json:"resume"`
		} `json:"links"`
	} `json:"profile"`

	Availability struct {
		Status       string `json:"status"`
		Seeking      string `json:"seeking"`
		Preferences  string `json:"preferences"`
		Arrangement  string `json:"arrangement"`
		NoticePeriod string `json:"noticePeriod"`
		Contact      string `json:"contact"`
		Note         string `json:"note"`
	} `json:"availability"`

	Boundaries   []string `json:"boundaries"`
	WorkingStyle []string `json:"workingStyle"`

	Skills []struct {
		Label string `json:"label"`
		Value string `json:"value"`
	} `json:"skills"`

	Experience []struct {
		Company  string `json:"company"`
		Location string `json:"location"`
		Period   string `json:"period"`
		Roles    []struct {
			Title   string   `json:"title"`
			Bullets []string `json:"bullets"`
		} `json:"roles"`
	} `json:"experience"`

	Education []struct {
		Institution          string `json:"institution"`
		Program              string `json:"program"`
		Period               string `json:"period"`
		CertificatesRequired int    `json:"certificatesRequired"`
		Certificates         []struct {
			Name   string `json:"name"`
			Status string `json:"status"`
		} `json:"certificates"`
	} `json:"education"`

	Certifications []struct {
		Name          string   `json:"name"`
		Issuer        string   `json:"issuer"`
		Period        string   `json:"period"`
		Expires       string   `json:"expires"`
		Description   string   `json:"description"`
		Topics        []string `json:"topics"`
		CredentialURL string   `json:"credentialUrl"`
	} `json:"certifications"`

	Projects []struct {
		ID          string   `json:"id"`
		Name        string   `json:"name"`
		Context     string   `json:"context"`
		Role        string   `json:"role"`
		Link        string   `json:"link"`
		Description string   `json:"description"`
		Stack       []string `json:"stack"`
		Bullets     []string `json:"bullets"`
	} `json:"projects"`
}

// loadContext reads the portfolio file and renders it as labelled plain text
// for the system prompt. Returns an error if the file is missing or malformed.
func loadContext(path string) (string, error) {
	body, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	var p portfolio
	if err := json.Unmarshal(body, &p); err != nil {
		return "", fmt.Errorf("parsing %s: %w", path, err)
	}

	if p.Profile.Name == "" {
		return "", fmt.Errorf("%s has no profile name", path)
	}

	var b strings.Builder

	fmt.Fprintf(&b, "Name: %s\n", p.Profile.Name)
	fmt.Fprintf(&b, "Role: %s\n", p.Profile.Title)
	fmt.Fprintf(&b, "Location: %s\n", p.Profile.Location)

	if p.Profile.CareerStartYear > 0 {
		fmt.Fprintf(&b, "Experience: %d+ years, working since %d\n",
			time.Now().Year()-p.Profile.CareerStartYear, p.Profile.CareerStartYear)
	}

	fmt.Fprintf(&b, "About: %s\n", p.Profile.Summary)
	fmt.Fprintf(&b, "Contact: %s, LinkedIn %s, resume %s\n",
		p.Profile.Links.Email, p.Profile.Links.LinkedIn, p.Profile.Links.Resume)
	b.WriteString("Resume card marker: [[resume]]\n")

	if a := p.Availability; a.Status != "" {
		b.WriteString("\nAvailability\n")
		fmt.Fprintf(&b, "- Status: %s\n", a.Status)
		writeField(&b, "Looking for", a.Seeking)
		writeField(&b, "Preferences", a.Preferences)
		writeField(&b, "Arrangement", a.Arrangement)
		writeField(&b, "Notice period", a.NoticePeriod)
		writeField(&b, "Preferred contact", a.Contact)
		writeField(&b, "Note", a.Note)
	}

	if len(p.Boundaries) > 0 {
		b.WriteString("\nOff-limits topics\n")
		for _, rule := range p.Boundaries {
			fmt.Fprintf(&b, "- %s\n", rule)
		}
	}

	if len(p.WorkingStyle) > 0 {
		b.WriteString("\nWorking style\n")
		for _, line := range p.WorkingStyle {
			fmt.Fprintf(&b, "- %s\n", line)
		}
	}

	if len(p.Skills) > 0 {
		b.WriteString("\nSkills\n")
		for _, skill := range p.Skills {
			fmt.Fprintf(&b, "- %s: %s\n", skill.Label, skill.Value)
		}
	}

	if len(p.Experience) > 0 {
		b.WriteString("\nWork experience\n")
		for _, job := range p.Experience {
			fmt.Fprintf(&b, "%s, %s (%s)\n", job.Company, job.Location, job.Period)
			for _, role := range job.Roles {
				fmt.Fprintf(&b, "  %s\n", role.Title)
				for _, bullet := range role.Bullets {
					fmt.Fprintf(&b, "  - %s\n", bullet)
				}
			}
		}
	}

	if len(p.Education) > 0 {
		b.WriteString("\nEducation\n")
		for _, entry := range p.Education {
			fmt.Fprintf(&b, "%s, %s (%s)\n", entry.Institution, entry.Program, entry.Period)
			if entry.CertificatesRequired > 0 {
				done := 0
				for _, certificate := range entry.Certificates {
					if certificate.Status == "Completed" {
						done++
					}
				}
				fmt.Fprintf(&b, "  Stackable programme: the degree is awarded on %d graduate certificates, %d completed so far\n",
					entry.CertificatesRequired, done)
			}
			for _, certificate := range entry.Certificates {
				fmt.Fprintf(&b, "  - Graduate certificate, %s: %s\n", certificate.Name, certificate.Status)
			}
		}
	}

	if len(p.Certifications) > 0 {
		b.WriteString("\nCertifications\n")
		for _, cert := range p.Certifications {
			fmt.Fprintf(&b, "%s, %s (%s)", cert.Name, cert.Issuer, cert.Period)
			if cert.Expires != "" {
				fmt.Fprintf(&b, ", expires %s", cert.Expires)
			}
			if cert.CredentialURL != "" {
				fmt.Fprintf(&b, ", credential %s", cert.CredentialURL)
			}
			b.WriteString("\n")
			if cert.Description != "" {
				fmt.Fprintf(&b, "  %s\n", cert.Description)
			}
			if len(cert.Topics) > 0 {
				fmt.Fprintf(&b, "  Topics: %s\n", strings.Join(cert.Topics, ", "))
			}
		}
	}

	if len(p.Projects) > 0 {
		b.WriteString("\nProjects\n")
		for _, project := range p.Projects {
			fmt.Fprintf(&b, "%s · %s (%s)\n", project.Name, project.Context, project.Role)
			fmt.Fprintf(&b, "  Card marker: [[project:%s]]\n", project.ID)
			if project.Link != "" {
				fmt.Fprintf(&b, "  Link: %s\n", project.Link)
			}
			fmt.Fprintf(&b, "  %s\n", project.Description)
			if len(project.Stack) > 0 {
				fmt.Fprintf(&b, "  Stack: %s\n", strings.Join(project.Stack, ", "))
			}
			for _, bullet := range project.Bullets {
				fmt.Fprintf(&b, "  - %s\n", bullet)
			}
		}
	}

	return b.String(), nil
}

// writeField appends a labelled bullet, skipping empty values.
func writeField(b *strings.Builder, label, value string) {
	if value == "" {
		return
	}
	fmt.Fprintf(b, "- %s: %s\n", label, value)
}
