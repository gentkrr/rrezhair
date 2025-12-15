import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const generateDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Adjust for Monday start (0 = Sunday in JS)
        const padding = startDay === 0 ? 6 : startDay - 1;

        for (let i = 0; i < padding; i++) {
            days.push(<div key={`pad-${i}`} className="h-10 w-10" />);
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date().setHours(0, 0, 0, 0);

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => onDateSelect(date)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition
            ${isSelected ? 'bg-primary-600 text-white' : 'hover:bg-primary-100 text-slate-700'}
            ${isToday && !isSelected ? 'border border-primary-600 text-primary-600' : ''}
            ${isPast ? 'text-slate-300 cursor-not-allowed hover:bg-transparent' : ''}
          `}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        disabled={currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>

            <div className="grid grid-cols-7 gap-1 place-items-center">
                {generateDays()}
            </div>
        </div>
    );
};

export default BookingCalendar;
