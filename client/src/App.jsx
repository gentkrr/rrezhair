import { useState, useEffect } from 'react'
import { Calendar, Clock, Scissors, User, MapPin, Phone, Instagram, Facebook, CheckCircle, Shield, Terminal } from 'lucide-react'
import axios from 'axios'
import BookingCalendar from './components/BookingCalendar'
import TimeSlots from './components/TimeSlots'
import BookingForm from './components/BookingForm'
import AdminDashboard from './pages/AdminDashboard'
import CICDPage from './pages/CICDPage'

function App() {
  // Simple routing based on URL hash or state
  const [currentPage, setCurrentPage] = useState('home'); // home, admin, cicd
  const [apiStatus, setApiStatus] = useState('Chargement...')

  // Booking State
  const [bookingStep, setBookingStep] = useState('date'); // date, time, form, success
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/ci-cd') {
      setCurrentPage('cicd');
    }
  }, []);

  useEffect(() => {
    axios.get('/api/health')
      .then(res => setApiStatus(res.data.status || 'Connecté'))
      .catch(err => setApiStatus('Erreur de connexion API'))
  }, [])

  // Fetch slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      // Fix timezone issue: Use local date components
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      axios.get(`/api/creneaux?date=${dateStr}`)
        .then(res => {
          setAvailableSlots(res.data);
          setLoadingSlots(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingSlots(false);
        });
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setBookingStep('time');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingStep('form');
  };

  const handleSuccess = (bookingData) => {
    setBookingStep('success');
  };

  const resetBooking = () => {
    setBookingStep('date');
    setSelectedDate(new Date());
    setSelectedTime(null);
  };

  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  if (currentPage === 'cicd') {
    return <CICDPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-900">Rrez'hair</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#home" className="text-slate-600 hover:text-primary-600 font-medium">Accueil</a>
            <a href="#booking" className="text-slate-600 hover:text-primary-600 font-medium">Réserver</a>
            <a href="#contact" className="text-slate-600 hover:text-primary-600 font-medium">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-1 rounded-full ${apiStatus.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              API: {apiStatus}
            </span>
            <a href="#booking" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium">
              Prendre RDV
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Votre Style, Notre Passion</h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Découvrez une expérience de coiffure unique chez Rrez'hair.
            Coupes modernes, soins experts et ambiance détendue.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#booking" className="bg-white text-primary-900 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Réserver maintenant
            </a>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Réserver un créneau</h2>
            <p className="text-slate-600">Choisissez le moment qui vous convient le mieux</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {bookingStep === 'success' ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Réservation Confirmée !</h3>
                <p className="text-slate-600 mb-8">
                  Votre rendez-vous a été enregistré avec succès.<br />
                  Un email de confirmation vous a été envoyé.
                </p>
                <button
                  onClick={resetBooking}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition"
                >
                  Réserver un autre RDV
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-12 gap-8">
                {/* Calendar Column */}
                <div className="md:col-span-5">
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />
                </div>

                {/* Slots/Form Column */}
                <div className="md:col-span-7">
                  {bookingStep === 'date' || bookingStep === 'time' ? (
                    <TimeSlots
                      slots={availableSlots}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={handleTimeSelect}
                      loading={loadingSlots}
                    />
                  ) : (
                    <BookingForm
                      date={selectedDate}
                      time={selectedTime}
                      onBack={() => setBookingStep('time')}
                      onSuccess={handleSuccess}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold">Rrez'hair</span>
            </div>
            <p className="text-sm">Votre salon de coiffure de référence pour un style impeccable.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Rue de la Coiffure</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 01 23 45 67 89</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Horaires</h4>
            <ul className="space-y-2 text-sm">
              <li>Lundi - Vendredi: 9h - 19h</li>
              <li>Samedi: 9h - 18h</li>
              <li>Dimanche: Fermé</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="hover:text-white transition"><Facebook className="h-6 w-6" /></a>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <a href="/admin" className="text-xs text-slate-700 hover:text-white flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </a>
              <a href="/ci-cd" className="text-xs text-slate-700 hover:text-white flex items-center gap-1">
                <Terminal className="h-3 w-3" /> CI/CD
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
