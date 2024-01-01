// components/EventRow.tsx
import React from 'react';
import { format } from 'date-fns';

interface EventRowProps {
    startTime: number;
    days: string[];
    events: any[];
}

const EventRow: React.FC<EventRowProps> = ({ startTime, days, events }) => (
    <tr>
        <td>{format(new Date(startTime * 60 * 60 * 1000), 'HH:mm')}</td>
        {days.map((day, index) => (
            <td key={index}>
                {events
                    .filter(
                        (event) =>
                            new Date(event.start * 1000).getHours() ===
                            Math.floor(startTime) &&
                            format(new Date(event.start * 1000), 'dd.MM.yyyy') === day
                    )
                    .map((event, eventIndex) => (
                        <div key={eventIndex}>
                            <strong>{event.title}</strong>
                            <br />
                            {format(new Date(event.start * 1000), 'HH:mm')} -{' '}
                            {format(new Date(event.end * 1000), 'HH:mm')}
                            <br />
                            {event.description}
                        </div>
                    ))}
            </td>
        ))}
    </tr>
);

export default EventRow;
