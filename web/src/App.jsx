import { useState, useEffect } from 'react'
import {
  FileText,
  FileDown,
  Grid,
  Mail,
  Github,
  Globe,
  Moon,
  Sun,
  Microscope,
  Code,
  FlaskConical,
  GraduationCap,
  FolderOpen,
  Trophy,
  Award,
  Wallet,
  BookOpen,
  Shield
} from 'lucide-react'
import './App.css'

// Section icon mapping
const sectionIcons = {
  'Research Interest': Microscope,
  'Skills': Code,
  'Research Experience': FlaskConical,
  'Education': GraduationCap,
  'Projects': FolderOpen,
  'Scholarships': Trophy,
  'Awards & Honors': Award,
  'Research Grants': Wallet,
  'Additional Activity': BookOpen,
  'Military Service': Shield,
}

function App() {
  const [activeTab, setActiveTab] = useState('cv')
  const [cvData, setCvData] = useState(null)
  const [templateData, setTemplateData] = useState(null)
  const [galleryData, setGalleryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState('light')

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    async function loadData() {
      try {
        // Load JSON data files with relative paths
        const [cvRes, templateRes, galleryRes] = await Promise.all([
          fetch('./data/cv-data.json'),
          fetch('./data/template.json'),
          fetch('./data/gallery.json')
        ])

        if (!cvRes.ok || !templateRes.ok) {
          throw new Error('Failed to load data. Run ./scripts/compile.sh first.')
        }

        const cv = await cvRes.json()
        const template = await templateRes.json()
        const gallery = galleryRes.ok ? await galleryRes.json() : { project_highlights: [] }

        setCvData(cv)
        setTemplateData(template)
        setGalleryData(gallery)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <p>Make sure to run <code>./scripts/compile.sh</code> first to generate JSON data files.</p>
      </div>
    )
  }

  const profile = cvData.profile || {}
  const sections = templateData?.sections || []

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="header-content">
          <h1>{profile.name || 'CV Template'}</h1>
          <p className="subtitle">{profile.title}</p>
          {profile.update && (
            <p className="update-date">Last updated: {profile.update}</p>
          )}
        </div>
      </header>

      {/* Navigation */}
      <div className="nav-container">
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'cv' ? 'active' : ''}`}
            onClick={() => setActiveTab('cv')}
          >
            <FileText size={18} /> CV
          </button>
          <button
            className={`nav-btn ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
          >
            <FileDown size={18} /> PDF
          </button>
          <button
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Grid size={18} /> Gallery
          </button>
        </nav>
      </div>

      <main className="main">
        {/* Contact Info */}
        <div className="contact-info">
          {profile.email && (
            <a className="contact-item" href={`mailto:${profile.email}`}>
              <Mail size={16} /> {profile.email}
            </a>
          )}
          {profile.github && (
            <a className="contact-item" href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
              <Github size={16} /> {profile.github}
            </a>
          )}
          {profile.blog && (
            <a className="contact-item" href={`https://${profile.blog}`} target="_blank" rel="noopener noreferrer">
              <Globe size={16} /> {profile.blog}
            </a>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'cv' && (
          <CVContent cvData={cvData} sections={sections} />
        )}
        {activeTab === 'pdf' && (
          <PDFViewer />
        )}
        {activeTab === 'gallery' && (
          <Gallery items={galleryData?.project_highlights || []} />
        )}
      </main>
    </div>
  )
}

// CV Content Component
function CVContent({ cvData, sections }) {
  return (
    <div className="cv-content">
      {sections.map((section, index) => (
        <Section
          key={index}
          name={section.name}
          template={section.template}
          data={cvData[section.source]}
          cvData={cvData}
        />
      ))}
    </div>
  )
}

// Section Component
function Section({ name, template, data, cvData }) {
  if (!data) return null

  const IconComponent = sectionIcons[name] || FileText

  return (
    <section className="section">
      <div className="section-header">
        <IconComponent size={20} />
        <h2>{name}</h2>
      </div>
      <div className="section-content">
        {template === 'text_block' && <TextBlock data={data} keywords={cvData?.keywords} />}
        {template === 'skills_list' && <SkillsList data={data} />}
        {template === 'experience_list' && <ExperienceList data={data} />}
        {template === 'education' && <Education data={data} />}
        {template === 'awards' && <Awards data={data} />}
        {template === 'single_entry' && <SingleEntry data={data} />}
      </div>
    </section>
  )
}

// Template Components
function TextBlock({ data, keywords }) {
  return (
    <div className="text-block">
      <p>{data}</p>
      {keywords && keywords.length > 0 && (
        <div className="keywords">
          {keywords.map((kw, i) => (
            <span key={i} className="keyword">{kw}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function SkillsList({ data }) {
  if (!data || typeof data !== 'object') return null

  return (
    <div className="skills">
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="skills-category">
          <h3>{category.replace(/_/g, ' ')}</h3>
          <ul className="skills-list">
            {Array.isArray(items) && items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ExperienceList({ data }) {
  if (!Array.isArray(data)) return null

  return (
    <div className="experiences">
      {data.map((exp, i) => (
        <div key={i} className="experience-item">
          <div className="experience-header">
            <span className="experience-title">{exp.title}</span>
            <span className="experience-duration">{exp.duration}</span>
          </div>
          {(exp.organization || exp.lab) && (
            <div className="experience-org">
              {exp.organization || exp.lab}
              {exp.advisor && ` • ${exp.advisor}`}
            </div>
          )}
          {exp.achievements && (
            <ul className="experience-achievements">
              {exp.achievements.map((ach, j) => (
                <li key={j}>{ach}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

function Education({ data }) {
  if (!data || typeof data !== 'object') return null

  return (
    <div className="education-info">
      <div className="education-row">
        <span className="education-label">{data.university}</span>
        <span className="education-value">{data.duration}</span>
      </div>
      <div className="education-row">
        <span className="education-label">{data.degree}</span>
        <span className="education-value">GPA: {data.gpa}</span>
      </div>
    </div>
  )
}

function Awards({ data }) {
  if (!Array.isArray(data)) return null

  return (
    <div className="awards">
      {data.map((award, i) => (
        <div key={i} className="award-item">
          <span className="award-name">{award.name}</span>
          <span className="award-details">
            {award.institution}, {award.year}
            {award.amount && ` • ${award.amount}`}
          </span>
        </div>
      ))}
    </div>
  )
}

function SingleEntry({ data }) {
  if (!data || typeof data !== 'object') return null

  // Handle military service format
  if (data.branch) {
    return (
      <div className="single-entry">
        <div className="experience-header">
          <span className="experience-title">{data.branch} ({data.rank})</span>
          <span className="experience-duration">{data.duration}</span>
        </div>
      </div>
    )
  }

  // Handle additional activity format
  return (
    <div className="single-entry">
      <div className="experience-header">
        <span className="experience-title">{data.activity}</span>
        <span className="experience-duration">{data.duration}</span>
      </div>
      {data.description && (
        <p className="text-block">{data.description}</p>
      )}
    </div>
  )
}

// PDF Viewer Component
function PDFViewer() {
  return (
    <div className="pdf-viewer">
      <object
        data="./data/CV.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
      >
        <div className="pdf-fallback">
          <p>PDF viewer not available in your browser.</p>
          <a href="./data/CV.pdf" download>Download PDF</a>
        </div>
      </object>
    </div>
  )
}

// Gallery Component
function Gallery({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="loading">
        <p>No gallery items yet. Add projects to gallery.yml</p>
      </div>
    )
  }

  return (
    <div className="gallery-grid">
      {items.map((item, i) => (
        <div key={i} className="gallery-item">
          <img
            className="gallery-image"
            src={item.image?.split('?')[0] || '/placeholder.png'}
            alt={item.title}
            onError={(e) => { e.target.src = '/placeholder.png' }}
          />
          <div className="gallery-content">
            <div className="gallery-title">{item.title}</div>
            <div className="gallery-period">{item.period}</div>
            <div className="gallery-description">
              {item.descriptions?.join(' • ')}
            </div>
            <div className="gallery-tags">
              {item.is_team && <span className="team-badge">Team</span>}
              {item.custom_tag?.split(',').map((tag, j) => (
                <span key={j} className="gallery-tag">{tag.trim()}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
