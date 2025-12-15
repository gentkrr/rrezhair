import { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, User, Mail, PlusCircle, X, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'slots'
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creationMode, setCreationMode] = useState('single'); // 'single' or 'bulk'

    // Single Slot State
    const [newSlot, setNewSlot] = useState({ date: '', start: '', end: '' });

    // Bulk Slot State
    const [bulkConfig, setBulkConfig] = useState({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
        interval: 30, // minutes
        days: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 0: false } // Mon-Sat enabled by default
    });

    const timeOptions = [];
    for (let h = 8; h <= 20; h++) {
        for (let m = 0; m < 60; m += 30) {
            const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            timeOptions.push(time);
        }
    }

    const fetchBookings = () => {
        setLoading(true);
        axios.get('/api/rendezvous')
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Erreur lors du chargement des réservations");
                setLoading(false);
            });
    };

    const fetchSlots = () => {
        setLoading(true);
        axios.get('/api/creneaux')
            .then(res => {
                setSlots(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Erreur lors du chargement des créneaux");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (activeTab === 'bookings') {
            fetchBookings();
        } else {
            fetchSlots();
        }
    }, [activeTab]);

    const handleDeleteBooking = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
            try {
                await axios.patch(`/api/rendezvous/${id}/cancel`);
                fetchBookings();
            } catch (err) {
                alert("Erreur lors de l'annulation");
            }
        }
    };

    const handleDeleteSlot = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
            try {
                await axios.delete(`/api/creneaux/${id}`);
                fetchSlots();
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        try {
            if (creationMode === 'single') {
                await axios.post('/api/creneaux', {
                    date: newSlot.date,
                    start: newSlot.start,
                    end: newSlot.end,
                    disponible: true
                });
            } else {
                // Bulk Generation Logic
                const start = new Date(bulkConfig.startDate);
                const end = new Date(bulkConfig.endDate);

                // Loop through days
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const dayOfWeek = d.getDay();
                    if (bulkConfig.days[dayOfWeek]) {
                        const dateStr = d.toISOString().split('T')[0];

                        // Calculate ranges based on interval
                        const ranges = [];
                        const [startH, startM] = bulkConfig.startTime.split(':').map(Number);
                        const [endH, endM] = bulkConfig.endTime.split(':').map(Number);

                        let current = new Date(d);
                        current.setHours(startH, startM, 0, 0);

                        const endTime = new Date(d);
                        endTime.setHours(endH, endM, 0, 0);

                        while (current < endTime) {
                            const slotStart = new Date(current);
                            const slotEnd = new Date(current.getTime() + bulkConfig.interval * 60000);

                            if (slotEnd <= endTime) {
                                ranges.push({
                                    start: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    end: slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                });
                            }
                            current = slotEnd;
                        }

                        if (ranges.length > 0) {
                            await axios.post('/api/creneaux/bulk', {
                                date: dateStr,
                                ranges: ranges,
                                intervalMinutes: bulkConfig.interval
                            });
                        }
                    }
                }
            }

            setIsModalOpen(false);
            setNewSlot({ date: '', start: '', end: '' });
            fetchSlots();
            alert("Créneaux générés avec succès !");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création. Vérifiez les données.");
        }
    };

    const toggleDay = (dayIndex) => {
        setBulkConfig(prev => ({
            ...prev,
            days: { ...prev.days, [dayIndex]: !prev.days[dayIndex] }
        }));
    };

    const daysMap = { 1: 'Lun', 2: 'Mar', 3: 'Mer', 4: 'Jeu', 5: 'Ven', 6: 'Sam', 0: 'Dim' };

    if (loading && bookings.length === 0 && slots.length === 0) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Administration Rrez'hair</h1>
                    {activeTab === 'slots' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Ajouter un créneau
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 px-2 font-medium transition ${activeTab === 'bookings' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Réservations
                    </button>
                    <button
                        onClick={() => setActiveTab('slots')}
                        className={`pb-4 px-2 font-medium transition ${activeTab === 'slots' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Gestion des Créneaux
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {activeTab === 'bookings' ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Date & Heure</th>
                                    <th className="p-4 font-semibold text-slate-600">Client</th>
                                    <th className="p-4 font-semibold text-slate-600">Email</th>
                                    <th className="p-4 font-semibold text-slate-600">Statut</th>
                                    <th className="p-4 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((booking) => {
                                    const date = booking.creneauId ? new Date(booking.creneauId.debut) : null;
                                    return (
                                        <tr key={booking._id} className="hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        {date ? date.toLocaleDateString() : 'Date inconnue'}
                                                    </span>
                                                    <span className="text-sm text-slate-500 flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-slate-400" />
                                                        {date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    {booking.clientNom} {booking.clientPrenom}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    {booking.clientEmail}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.statut === 'CONFIRME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {booking.statut}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                                    title="Annuler le RDV"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">Aucune réservation trouvée</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Date</th>
                                    <th className="p-4 font-semibold text-slate-600">Heure</th>
                                    <th className="p-4 font-semibold text-slate-600">État</th>
                                    <th className="p-4 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {slots.map((slot) => {
                                    const d1 = new Date(slot.debut);
                                    const d2 = new Date(slot.fin);
                                    return (
                                        <tr key={slot.id || slot._id} className="hover:bg-slate-50">
                                            <td className="p-4 font-medium">
                                                {d1.toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {d1.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {d2.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                {slot.disponible ? (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" /> Disponible
                                                    </span>
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                                                        Réservé
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteSlot(slot.id || slot._id)}
                                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                                                    title="Supprimer le créneau"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {slots.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500">Aucun créneau disponible</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Ajout Créneau */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Ajouter des créneaux</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Mode Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setCreationMode('single')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${creationMode === 'single' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'}`}
                            >
                                Créneau Unique
                            </button>
                            <button
                                onClick={() => setCreationMode('bulk')}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${creationMode === 'bulk' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500'}`}
                            >
                                Génération Multiple
                            </button>
                        </div>

                        <form onSubmit={handleAddSlot} className="space-y-4">
                            {creationMode === 'single' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={newSlot.date}
                                            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Début</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={newSlot.start}
                                                onChange={e => setNewSlot({ ...newSlot, start: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Fin</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={newSlot.end}
                                                onChange={e => setNewSlot({ ...newSlot, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Du</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={bulkConfig.startDate}
                                                onChange={e => setBulkConfig({ ...bulkConfig, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Au</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={bulkConfig.endDate}
                                                onChange={e => setBulkConfig({ ...bulkConfig, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Heure Début</label>
                                            <select
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={bulkConfig.startTime}
                                                onChange={e => setBulkConfig({ ...bulkConfig, startTime: e.target.value })}
                                            >
                                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Heure Fin</label>
                                            <select
                                                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                value={bulkConfig.endTime}
                                                onChange={e => setBulkConfig({ ...bulkConfig, endTime: e.target.value })}
                                            >
                                                {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Intervalle (minutes)</label>
                                        <select
                                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={bulkConfig.interval}
                                            onChange={e => setBulkConfig({ ...bulkConfig, interval: Number(e.target.value) })}
                                        >
                                            <option value={15}>15 minutes</option>
                                            <option value={30}>30 minutes</option>
                                            <option value={45}>45 minutes</option>
                                            <option value={60}>1 heure</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Jours de la semaine</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[1, 2, 3, 4, 5, 6, 0].map(day => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${bulkConfig.days[day]
                                                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                                                        }`}
                                                >
                                                    {daysMap[day]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition mt-4"
                            >
                                {creationMode === 'single' ? 'Créer le créneau' : 'Générer les créneaux'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
