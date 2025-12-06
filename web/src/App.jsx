import { useState, useEffect } from 'react'
import './App.css'

// Icons as simple SVG components
const FileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

const FileDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9,15 12,18 15,15" />
  </svg>
)

const Grid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

const Mail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const Github = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Globe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

// Section icons
const sectionIcons = {
  'Research Interest': '🔬',
  'Skills': '💻',
  'Research Experience': '🧪',
  'Education': '🎓',
  'Projects': '📂',
  'Scholarships': '🏆',
  'Awards & Honors': '🏅',
  'Research Grants': '💰',
  'Additional Activity': '📚',
  'Military Service': '🛡️',
}

function App() {
  const [activeTab, setActiveTab] = useState('cv')
  const [cvData, setCvData] = useState(null)
  const [templateData, setTemplateData] = useState(null)
  const [galleryData, setGalleryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load JSON data files
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
        <h1>{profile.name || 'CV Template'}</h1>
        <p className="subtitle">{profile.title}</p>
        {profile.update && (
          <p className="update-date">Last updated: {profile.update}</p>
        )}
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'cv' ? 'active' : ''}`}
          onClick={() => setActiveTab('cv')}
        >
          <FileText /> CV
        </button>
        <button
          className={`nav-btn ${activeTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdf')}
        >
          <FileDown /> PDF
        </button>
        <button
          className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <Grid /> Gallery
        </button>
      </nav>

      <main className="main">
        {/* Contact Info */}
        <div className="contact-info">
          {profile.email && (
            <a className="contact-item" href={`mailto:${profile.email}`}>
              <Mail /> {profile.email}
            </a>
          )}
          {profile.github && (
            <a className="contact-item" href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer">
              <Github /> {profile.github}
            </a>
          )}
          {profile.blog && (
            <a className="contact-item" href={`https://${profile.blog}`} target="_blank" rel="noopener noreferrer">
              <Globe /> {profile.blog}
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

  const icon = sectionIcons[name] || '📄'

  return (
    <section className="section">
      <div className="section-header">
        <span>{icon}</span>
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
