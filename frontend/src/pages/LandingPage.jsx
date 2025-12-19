import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { ToastContainer } from "../components/ui/Toast"
import {
  Code2,
  Palette,
  Smartphone,
  Globe,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Star,
  CheckCircle,
  Brain,
  Cloud,
  Shield,
  Zap,
  Menu,
  X,
  Settings,
} from "lucide-react"

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    message: "",
  })
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  
  // New State for Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // State for interactive background glow following the cursor
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })

  // State for projects and clients from backend
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingClients, setLoadingClients] = useState(true)

  // Toast notifications state
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type, duration: 4000 }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Get API base URL from environment or use default
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`)
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          console.error('Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients`)
        if (response.ok) {
          const data = await response.json()
          setClients(data)
        } else {
          console.error('Failed to fetch clients')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setLoadingClients(false)
      }
    }
    fetchClients()
  }, [])

  // Update background highlight based on mouse position
  const handleBackgroundMouseMove = (event) => {
    const { innerWidth, innerHeight } = window
    const x = (event.clientX / innerWidth) * 100
    const y = (event.clientY / innerHeight) * 100
    setCursorPosition({ x, y })
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      })
      
      if (response.ok) {
        setContactSubmitted(true)
        setTimeout(() => {
          setContactSubmitted(false)
          setContactForm({ fullName: "", email: "", mobile: "", city: "", message: "" })
        }, 3000)
      } else {
        const error = await response.json()
        console.error('Error submitting contact form:', error)
        addToast(error.error || 'Failed to submit form. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      addToast('Failed to submit form. Please check your connection and try again.', 'error')
    }
  }

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/newsletters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      
      if (response.ok) {
        setNewsletterSubmitted(true)
        setTimeout(() => {
          setNewsletterSubmitted(false)
          setNewsletterEmail("")
        }, 3000)
      } else {
        const error = await response.json()
        console.error('Error subscribing:', error)
        addToast(error.error || 'Failed to subscribe. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      addToast('Failed to subscribe. Please check your connection and try again.', 'error')
    }
  }

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 relative overflow-hidden"
      onMouseMove={handleBackgroundMouseMove}
    >
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Global background glow that reacts to mouse movement */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-all duration-300"
        style={{
          background: `
            radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(56,189,248,0.20), transparent 55%),
            radial-gradient(circle at 0% 0%, rgba(129,140,248,0.18), transparent 60%),
            radial-gradient(circle at 100% 100%, rgba(236,72,153,0.18), transparent 60%)
          `,
        }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white group">
              <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Code2 className="h-6 w-6 text-blue-500" />
              </div>
              DevStudio
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Projects', 'Clients', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-slate-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all"
                >
                  {item}
                </a>
              ))}
              <Link 
                to="/admin"
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-slate-950 border-b border-slate-800 p-4 animate-in slide-in-from-top-5 duration-200">
            <nav className="flex flex-col gap-4">
              {['Projects', 'Clients', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
                >
                  {item}
                </a>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-medium text-slate-300 hover:text-white py-2 border-b border-slate-800/50"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-24 sm:pb-40 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-50 mix-blend-screen animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-8 text-balance leading-[1.1]">
              <span className="text-white">Innovate Faster with</span>
              <br className="hidden md:block" />
              <span className="text-white ml-2">
                 DevStudio
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-slate-400 mb-12 leading-relaxed text-pretty">
              Empowering businesses with cutting-edge software solutions. From AI-driven analytics to seamless cloud
              integrations, we're shaping the future of technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                  size="lg"
                  variant="outline"
                  className="w-fit px-0 text-white hover:text-blue-300 decoration-blue-500/30"
              >
                Explore Solutions
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-fit px-0 text-white hover:text-blue-300 decoration-blue-500/30"
              >
                Schedule a Demo
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto">
              {[
                { icon: Code2, label: "Full Stack", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Smartphone, label: "Mobile Apps", color: "text-indigo-500", bg: "bg-indigo-500/10" },
                { icon: Palette, label: "UI/UX Design", color: "text-purple-500", bg: "bg-purple-500/10" },
                { icon: Globe, label: "Cloud Systems", color: "text-pink-500", bg: "bg-pink-500/10" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-900/50 transition-colors">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <p className="text-sm font-medium text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-white">
              Cutting-Edge Solutions
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover how DevStudio can transform your business with our innovative technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: "AI-Powered Analytics", desc: "Harness the power of machine learning to derive actionable insights from your data." },
              { icon: Cloud, title: "Cloud-Native Architecture", desc: "Scalable, resilient, and efficient solutions built for the modern cloud ecosystem." },
              { icon: Shield, title: "Enterprise-Grade Security", desc: "State-of-the-art security measures to protect your most valuable assets." },
              { icon: Zap, title: "High-Performance Systems", desc: "Optimized for speed and efficiency, our solutions deliver unparalleled performance." },
            ].map((solution, idx) => (
              <div key={idx} className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 hover:bg-slate-900/60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <solution.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {solution.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section id="projects" className="py-20 bg-slate-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white">Our Projects</h2>
              <p className="text-lg text-slate-400">
                Explore our portfolio of successful projects that showcase our expertise.
              </p>
            </div>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
              View All Works <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loadingProjects ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No projects available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 hover:scrollbar-thumb-slate-600">
              <div className="flex gap-6 min-w-max">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 w-[320px] sm:w-[380px] flex-shrink-0"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={`${BACKEND_URL}${project.image}`}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3 flex-1">{project.description}</p>
                      <Button
                        variant="link"
                        className="w-fit px-0 text-blue-400 hover:text-blue-300 decoration-blue-500/30"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Happy Clients Section */}
      <section id="clients" className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white">Happy Clients</h2>
            <p className="text-lg text-slate-400">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          {loadingClients ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No client testimonials available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 hover:scrollbar-thumb-slate-600">
              <div className="flex gap-6 min-w-max">
                {clients.map((client) => (
                  <div
                    key={client._id}
                    className="bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-800 hover:bg-slate-900/60 transition-colors w-[320px] sm:w-[400px] flex-shrink-0"
                  >
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <blockquote className="text-base sm:text-lg mb-6 sm:mb-8 text-slate-300 leading-relaxed italic">
                      "{client.description}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <img
                        src={`${BACKEND_URL}${client.image}`}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{client.name}</p>
                        <p className="text-sm text-slate-500">{client.designation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section - UPDATED */}
      <section id="contact" className="py-20 bg-gradient-to-b from-slate-900/20 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-white">Get In Touch</h2>
              <p className="text-lg text-slate-400">
                Have a project in mind? Let's discuss how we can help bring your vision to life.
              </p>
            </div>

            <div className="grid md:grid-cols-12 gap-12">
              {/* Contact Info */}
              <div className="md:col-span-5 space-y-8">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    {[
                      { icon: Mail, title: "Email Us", val: "contact@devstudio.com" },
                      { icon: Phone, title: "Call Us", val: "+1 (555) 123-4567" },
                      { icon: MapPin, title: "Visit Us", val: "123 Tech Street, CA" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{item.title}</p>
                          <p className="text-slate-400 text-sm">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form - ALL FIELDS NOW MATCH TEXTAREA STYLE */}
              <div className="md:col-span-7 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium text-slate-300">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-11 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium text-slate-300">
                        City
                      </label>
                      <Input
                        id="city"
                        placeholder="San Francisco"
                        value={contactForm.city}
                        onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-11 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-11 px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-sm font-medium text-slate-300">
                        Mobile Number
                      </label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={contactForm.mobile}
                        onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                        required
                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-11 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">
                      Message
                    </label>
                    <textarea
                      id="message"
                      placeholder="Tell us about your project..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 mt-2"
                    disabled={contactSubmitted}
                  >
                    {contactSubmitted ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Message Sent!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-16 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-6">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Stay Updated with DevStudio
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights, industry trends, and exclusive updates delivered
              directly to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={newsletterSubmitted}
                  className="flex-1 bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-slate-500 h-12 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={newsletterSubmitted}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 px-8"
                >
                  {newsletterSubmitted ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Subscribed!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Subscribe
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">DevStudio</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Building the future of digital experiences with innovative solutions. We help brands scale through technology.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-6">Solutions</h3>
              <ul className="space-y-4">
                {['AI Analytics', 'Cloud Architecture', 'Security', 'Mobile Dev'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-6">Company</h3>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-6">Legal</h3>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-slate-500 text-sm">© 2025 DevStudio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
