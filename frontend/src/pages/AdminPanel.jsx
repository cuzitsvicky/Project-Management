import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ToastContainer } from '../components/ui/Toast'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import {
  FolderOpen,
  Users,
  Mail,
  Bell,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Loader2,
  Menu,
  ArrowLeft,
  Code2
} from 'lucide-react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('projects')
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Projects state
  const [projects, setProjects] = useState([])
  const [projectForm, setProjectForm] = useState({ name: '', description: '', image: null })
  const [editingProject, setEditingProject] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)

  // Clients state
  const [clients, setClients] = useState([])
  const [clientForm, setClientForm] = useState({ name: '', designation: '', description: '', image: null })
  const [editingClient, setEditingClient] = useState(null)
  const [showClientModal, setShowClientModal] = useState(false)

  // Contacts state
  const [contacts, setContacts] = useState([])

  // Newsletters state
  const [newsletters, setNewsletters] = useState([])

  // Toast notifications state
  const [toasts, setToasts] = useState([])
  const [confirmDialog, setConfirmDialog] = useState(null)

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration: 4000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm })
  }

  // Image crop state - separate for projects and clients
  const [projectCrop, setProjectCrop] = useState({ unit: '%', width: 90, aspect: 450 / 350 })
  const [projectCompletedCrop, setProjectCompletedCrop] = useState(null)
  const [projectImgSrc, setProjectImgSrc] = useState('')
  const [projectImageFile, setProjectImageFile] = useState(null)

  const [clientCrop, setClientCrop] = useState({ unit: '%', width: 90, aspect: 450 / 350 })
  const [clientCompletedCrop, setClientCompletedCrop] = useState(null)
  const [clientImgSrc, setClientImgSrc] = useState('')
  const [clientImageFile, setClientImageFile] = useState(null)

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fetch data
  useEffect(() => {
    fetchProjects()
    fetchClients()
    fetchContacts()
    fetchNewsletters()
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from:', `${API_BASE_URL}/projects`)
      const response = await fetch(`${API_BASE_URL}/projects`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      console.error('API_BASE_URL:', API_BASE_URL)
      addToast('Failed to load projects. Please check your connection.', 'error')
    }
  }

  const fetchClients = async () => {
    try {
      console.log('Fetching clients from:', `${API_BASE_URL}/clients`)
      const response = await fetch(`${API_BASE_URL}/clients`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      console.error('API_BASE_URL:', API_BASE_URL)
      addToast('Failed to load clients. Please check your connection.', 'error')
    }
  }

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts from:', `${API_BASE_URL}/contacts`)
      const response = await fetch(`${API_BASE_URL}/contacts`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      console.error('API_BASE_URL:', API_BASE_URL)
      addToast('Failed to load contacts. Please check your connection.', 'error')
    }
  }

  const fetchNewsletters = async () => {
    try {
      console.log('Fetching newsletters from:', `${API_BASE_URL}/newsletters`)
      const response = await fetch(`${API_BASE_URL}/newsletters`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setNewsletters(data)
    } catch (error) {
      console.error('Error fetching newsletters:', error)
      console.error('API_BASE_URL:', API_BASE_URL)
      addToast('Failed to load newsletters. Please check your connection.', 'error')
    }
  }

  // Image handling
  const onSelectProjectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setProjectImgSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
      setProjectImageFile(e.target.files[0])
    }
  }

  const onSelectClientFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setClientImgSrc(reader.result))
      reader.readAsDataURL(e.target.files[0])
      setClientImageFile(e.target.files[0])
    }
  }

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const handleImageCrop = async (image, cropData) => {
    if (!cropData || !image) return null

    const croppedImageBlob = await getCroppedImg(image, cropData)
    return croppedImageBlob
  }

  // Project handlers
  const openProjectModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setProjectForm({ name: project.name, description: project.description, image: null })
    } else {
      setEditingProject(null)
      setProjectForm({ name: '', description: '', image: null })
    }
    setProjectImgSrc('')
    setProjectCompletedCrop(null)
    setProjectImageFile(null)
    setShowProjectModal(true)
  }

  const closeProjectModal = () => {
    setShowProjectModal(false)
    setEditingProject(null)
    setProjectForm({ name: '', description: '', image: null })
    setProjectImgSrc('')
    setProjectCompletedCrop(null)
    setProjectImageFile(null)
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', projectForm.name)
      formData.append('description', projectForm.description)

      if (projectImgSrc && projectCompletedCrop) {
        const image = document.getElementById('project-image')
        const croppedBlob = await handleImageCrop(image, projectCompletedCrop)
        if (croppedBlob) {
          formData.append('image', croppedBlob, 'project.jpg')
        }
      } else if (projectImageFile) {
        formData.append('image', projectImageFile)
      }

      const url = editingProject
        ? `${API_BASE_URL}/projects/${editingProject._id}`
        : `${API_BASE_URL}/projects`

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        body: formData,
      })

      if (response.ok) {
        await fetchProjects()
        closeProjectModal()
        addToast(editingProject ? 'Project updated successfully!' : 'Project created successfully!', 'success')
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to save project', 'error')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      addToast('Failed to save project. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    showConfirm('Are you sure you want to delete this project? This action cannot be undone.', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchProjects()
          addToast('Project deleted successfully!', 'success')
        } else {
          addToast('Failed to delete project', 'error')
        }
      } catch (error) {
        console.error('Error deleting project:', error)
        addToast('Failed to delete project. Please try again.', 'error')
      }
      setConfirmDialog(null)
    })
  }

  // Client handlers
  const openClientModal = (client = null) => {
    if (client) {
      setEditingClient(client)
      setClientForm({ name: client.name, designation: client.designation, description: client.description, image: null })
    } else {
      setEditingClient(null)
      setClientForm({ name: '', designation: '', description: '', image: null })
    }
    setClientImgSrc('')
    setClientCompletedCrop(null)
    setClientImageFile(null)
    setShowClientModal(true)
  }

  const closeClientModal = () => {
    setShowClientModal(false)
    setEditingClient(null)
    setClientForm({ name: '', designation: '', description: '', image: null })
    setClientImgSrc('')
    setClientCompletedCrop(null)
    setClientImageFile(null)
  }

  const handleClientSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', clientForm.name)
      formData.append('designation', clientForm.designation)
      formData.append('description', clientForm.description)

      if (clientImgSrc && clientCompletedCrop) {
        const image = document.getElementById('client-image')
        const croppedBlob = await handleImageCrop(image, clientCompletedCrop)
        if (croppedBlob) {
          formData.append('image', croppedBlob, 'client.jpg')
        }
      } else if (clientImageFile) {
        formData.append('image', clientImageFile)
      }

      const url = editingClient
        ? `${API_BASE_URL}/clients/${editingClient._id}`
        : `${API_BASE_URL}/clients`

      const response = await fetch(url, {
        method: editingClient ? 'PUT' : 'POST',
        body: formData,
      })

      if (response.ok) {
        await fetchClients()
        closeClientModal()
        addToast(editingClient ? 'Client updated successfully!' : 'Client created successfully!', 'success')
      } else {
        const error = await response.json()
        addToast(error.error || 'Failed to save client', 'error')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      addToast('Failed to save client. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (id) => {
    showConfirm('Are you sure you want to delete this client? This action cannot be undone.', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchClients()
          addToast('Client deleted successfully!', 'success')
        } else {
          addToast('Failed to delete client', 'error')
        }
      } catch (error) {
        console.error('Error deleting client:', error)
        addToast('Failed to delete client. Please try again.', 'error')
      }
      setConfirmDialog(null)
    })
  }

  // Contact handlers
  const handleDeleteContact = async (id) => {
    showConfirm('Are you sure you want to delete this contact submission?', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchContacts()
          addToast('Contact submission deleted successfully!', 'success')
        } else {
          addToast('Failed to delete contact', 'error')
        }
      } catch (error) {
        console.error('Error deleting contact:', error)
        addToast('Failed to delete contact. Please try again.', 'error')
      }
      setConfirmDialog(null)
    })
  }

  // Newsletter handlers
  const handleDeleteNewsletter = async (id) => {
    showConfirm('Are you sure you want to delete this newsletter subscription?', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchNewsletters()
          addToast('Newsletter subscription deleted successfully!', 'success')
        } else {
          addToast('Failed to delete subscription', 'error')
        }
      } catch (error) {
        console.error('Error deleting subscription:', error)
        addToast('Failed to delete subscription. Please try again.', 'error')
      }
      setConfirmDialog(null)
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog
        message={confirmDialog?.message || ''}
        onConfirm={confirmDialog?.onConfirm || (() => {})}
        onCancel={() => setConfirmDialog(null)}
        isOpen={!!confirmDialog}
      />
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back to Home */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white group p-2 -m-2 rounded-lg hover:bg-slate-900/50 transition-all">
                <div className="bg-blue-500/20 p-1 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Code2 className="h-6 w-6 text-blue-400" />
                </div>
                DevStudio
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-900/50 ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Desktop Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'projects', label: 'Projects', icon: FolderOpen },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'contacts', label: 'Contact Forms', icon: Mail },
                { id: 'newsletters', label: 'Newsletters', icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden text-slate-400 hover:text-white hover:bg-slate-900/50 p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 animate-in slide-in-from-top-2 duration-200">
              <nav className="flex flex-col gap-2">
                {[
                  { id: 'projects', label: 'Projects', icon: FolderOpen },
                  { id: 'clients', label: 'Clients', icon: Users },
                  { id: 'contacts', label: 'Contact Forms', icon: Mail },
                  { id: 'newsletters', label: 'Newsletters', icon: Bell },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500/10 text-blue-400 border-2 border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 flex-shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-300">Project Management</h2>
              </div>
              <Button onClick={() => openProjectModal()} className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all group">
                  <div className="relative overflow-hidden rounded-lg mb-4 h-48">
                    <img
                      src={`${BACKEND_URL}${project.image}`}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors">{project.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3">{project.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProjectModal(project)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-300">Client Management</h2>
              </div>
              <Button onClick={() => openClientModal()} className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <div key={client._id} className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
                  <img
                    src={`${BACKEND_URL}${client.image}`}
                    alt={client.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">{client.name}</h3>
                  <p className="text-blue-400 text-sm mb-2 font-medium">{client.designation}</p>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3">{client.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openClientModal(client)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-300">Contact Form Submissions</h2>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Full Name</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Email</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Mobile</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">City</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200 w-64">Message</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Date</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="border-t border-slate-800 hover:bg-slate-850 transition-colors">
                        <td className="px-4 lg:px-6 py-4 font-medium">{contact.fullName}</td>
                        <td className="px-4 lg:px-6 py-4">{contact.email}</td>
                        <td className="px-4 lg:px-6 py-4">{contact.mobile}</td>
                        <td className="px-4 lg:px-6 py-4">{contact.city}</td>
                        <td className="px-4 lg:px-6 py-4 max-w-md text-slate-400">
                          {contact.message ? (
                            <div className="whitespace-pre-wrap break-words">{contact.message}</div>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContact(contact._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-800">
                {contacts.map((contact) => (
                  <div key={contact._id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{contact.fullName}</h3>
                        <p className="text-sm text-slate-400">{contact.email}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteContact(contact._id)}
                        className="text-red-400 hover:text-red-300 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Mobile:</span>
                        <p className="text-slate-300">{contact.mobile}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">City:</span>
                        <p className="text-slate-300">{contact.city}</p>
                      </div>
                    </div>
                    {contact.message && (
                      <div>
                        <span className="text-slate-500 text-sm">Message:</span>
                        <p className="text-slate-300 text-sm mt-1 whitespace-pre-wrap break-words">{contact.message}</p>
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletters Tab */}
        {activeTab === 'newsletters' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
                <h2 className="text-xl font-semibold text-slate-300">Newsletter Subscriptions</h2>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Email</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Subscribed Date</th>
                      <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletters.map((newsletter) => (
                      <tr key={newsletter._id} className="border-t border-slate-800 hover:bg-slate-850 transition-colors">
                        <td className="px-4 lg:px-6 py-4 font-medium">{newsletter.email}</td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-slate-400">
                          {new Date(newsletter.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNewsletter(newsletter._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-800">
                {newsletters.map((newsletter) => (
                  <div key={newsletter._id} className="p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-white">{newsletter.email}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNewsletter(newsletter._id)}
                      className="text-red-400 hover:text-red-300 flex-shrink-0 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/100 backdrop-blur-sm z-10">
                <h3 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button onClick={closeProjectModal} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project Name</label>
                  <Input
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-12 px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectProjectFile}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                  />

                  {projectImgSrc && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <ReactCrop
                        crop={projectCrop}
                        onChange={(c) => setProjectCrop(c)}
                        onComplete={(c) => setProjectCompletedCrop(c)}
                        aspect={450 / 350}
                      >
                        <img
                          id="project-image"
                          src={projectImgSrc}
                          alt="Crop"
                          className="max-w-full h-auto rounded-lg"
                          onLoad={(e) => {
                            const { width, height } = e.currentTarget
                            setProjectCrop({ unit: '%', width: 90, aspect: 450 / 350 })
                          }}
                        />
                      </ReactCrop>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 h-12 font-semibold">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeProjectModal} className="h-12 px-8">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Client Modal */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/100 backdrop-blur-sm z-10">
                <h3 className="text-2xl font-bold text-white">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h3>
                <button onClick={closeClientModal} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleClientSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Client Name</label>
                  <Input
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-12 px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Designation</label>
                  <Input
                    value={clientForm.designation}
                    onChange={(e) => setClientForm({ ...clientForm, designation: e.target.value })}
                    placeholder="e.g., CEO, Web Developer, Designer"
                    required
                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-12 px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    value={clientForm.description}
                    onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Client Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectClientFile}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all"
                  />

                  {clientImgSrc && (
                    <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <ReactCrop
                        crop={clientCrop}
                        onChange={(c) => setClientCrop(c)}
                        onComplete={(c) => setClientCompletedCrop(c)}
                        aspect={450 / 350}
                      >
                        <img
                          id="client-image"
                          src={clientImgSrc}
                          alt="Crop"
                          className="max-w-full h-auto rounded-lg"
                          onLoad={(e) => {
                            const { width, height } = e.currentTarget
                            setClientCrop({ unit: '%', width: 90, aspect: 450 / 350 })
                          }}
                        />
                      </ReactCrop>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 h-12 font-semibold">
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        {editingClient ? 'Update Client' : 'Create Client'}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeClientModal} className="h-12 px-8">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
