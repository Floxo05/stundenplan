"use client";
import {useEffect, useState} from 'react';
import {addDays, endOfDay, endOfWeek, format, startOfDay, startOfWeek, subDays} from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import {Event} from '@/types/types';
import EventCard from "@/components/EventCard";

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allEventsForWeek, setAllEventsForWeek] = useState<Event[][]>([[]]);

    const getStartOfWeek = (date: Date) => {
        return startOfWeek(date, {weekStartsOn: 1});
    }

    const getEndOfWeek = (date: Date) => {
        return endOfWeek(date, {weekStartsOn: 1})
    }


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const startOfWeekDate = getStartOfWeek(currentDate);
        const allEventsForWeek: Event[][] = [];

        // Sammle alle Termine für die Woche in einem Array
        for (let i = 0; i < 5; i++) {
            const currentDay = addDays(startOfWeekDate, i);
            const currentDayEvents = getEventsForDay(currentDay);
            allEventsForWeek.push(currentDayEvents);
        }

        const allEventsObject = [];

        for (let i = 0; i < 7; i++) {
            allEventsObject.push([])
            for (let j = 0; j < 5; j++) {
                if (allEventsForWeek[j] !== undefined && allEventsForWeek[j][i] !== undefined) {
                    // @ts-ignore
                    allEventsObject[i].push(allEventsForWeek[j][i])
                } else {
                    // @ts-ignore
                    allEventsObject[i].push(null)
                }
            }
        }

        setAllEventsForWeek(allEventsObject)
    }, [events, currentDate]);

    const fetchData = async () => {
        try {
            const apiData = await fetch('/api/calender/get').then((res) => res.json());

            // Transformiere die Daten in das erwartete Format
            const transformedData = apiData.map((item: any, index: number) => ({
                id: index + 1,
                title: item.title,
                description: item.description,
                date: new Date(item.start * 1000).toISOString(), // Umwandlung von Unix-Zeitstempel in ISO-Format
                dateEnd: new Date(item.end * 1000).toISOString(), // Umwandlung von Unix-Zeitstempel in ISO-Format
                room: item.room,
            }));

            setEvents(transformedData);
        } catch (error) {
            console.error('Fehler beim Laden der Kalenderdaten:', error);
        }
    };

    const getEventsForDay = (date: Date): Event[] => {
        const startDate = startOfDay(date);
        const endDate = endOfDay(date);

        const filteredEvents = events.filter(
            (event) => {
                const eventDate = new Date(event.date).getTime();
                return eventDate >= startDate.getTime() && eventDate <= endDate.getTime();
            }
        );

        console.log('Filtered Events for Day:', date, filteredEvents);

        return filteredEvents;
    };

    const handlePrevWeek = () => {
        setCurrentDate((prevDate) => subDays(getStartOfWeek(prevDate), 1));
    };

    const handleNextWeek = () => {
        setCurrentDate((prevDate) => addDays(getEndOfWeek(prevDate), 1));
    };

    const renderTableHeader = () => {
        const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
        return (
            <tr>
                {weekdays.map((day, index) => (
                    <th key={index}>{day}</th>
                ))}
            </tr>
        );
    };

    const renderTableBody = () => {
        return allEventsForWeek.map((dayEvents, index) => (
            <tr key={index}>
                {dayEvents.map((event, index) => (
                    <EventCard event={event} index={index}/>
                ))}
            </tr>
        ));
    };

    return allEventsForWeek && (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Kalender</h1>
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevWeek} className="text-white">
                    Vorherige Woche
                </button>
                <span>{`${format(getStartOfWeek(currentDate), 'dd.MM.yyyy')} - ${format(
                    getEndOfWeek(currentDate),
                    'dd.MM.yyyy'
                )}`}</span>
                <button onClick={handleNextWeek} className="text-white">
                    Nächste Woche
                </button>
            </div>
            <div className={"table-container"}>
                <table className="w-full table">
                    <thead>{renderTableHeader()}</thead>
                    <tbody>{renderTableBody()}</tbody>
                </table>
            </div>
        </div>
    );
};

export default CalendarPage;