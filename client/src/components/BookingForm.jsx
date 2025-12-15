import { useState } from 'react';
import { User, Mail, Calendar, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BookingForm = ({ date, time, onBack, onSuccess }) => {
    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/rendezvous', {
                creneauId: time.id,
                clientPrenom: formData.prenom,
                clientNom: formData.nom,
                clientEmail: formData.email
            });

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirmer le RDV</h3>
                <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {date.toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {time.heure}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                placeholder="Jean"
                                value={formData.prenom}
                                onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                                placeholder="Dupont"
                                value={formData.nom}
                                onChange={e => setFormData({ ...formData, nom: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                            placeholder="jean@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition font-medium"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Validation...' : 'Confirmer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
