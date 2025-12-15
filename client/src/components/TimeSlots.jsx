import { Clock } from 'lucide-react';

const TimeSlots = ({ slots, selectedDate, selectedTime, onTimeSelect, loading }) => {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex items-center justify-center">
                <div className="text-slate-400 animate-pulse">Recherche des créneaux...</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-600" />
                Créneaux disponibles
            </h3>

            {slots.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                    Aucun créneau disponible pour cette date.
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {slots.filter(slot => new Date(slot.debut) > new Date()).map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => onTimeSelect(slot)}
                            disabled={!slot.disponible}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition border ${selectedTime?.id === slot.id
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50'
                                } ${!slot.disponible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {slot.heure}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimeSlots;
