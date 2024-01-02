import {format} from "date-fns";
import React from "react";
import {Event} from "@/types/types";
import {useMediaQuery} from "react-responsive";

interface EventCardProps {
    event: Event;
    index: number
}

const EventCard: React.FC<EventCardProps> = ({event, index}) => {

    return (
        <td key={index}>
            {event ? (
                <div className={"p-2 bg-gray-500 rounded"}>
                    <p className="text-xl font-bold">{event.description}</p>
                    <p className="">{event.instructor}</p>
                    <p className="">{event.room}</p>
                        <p className="">{`Start: ${format(new Date(event.date), 'HH:mm')} | End: ${format(
                        new Date(event.dateEnd),
                        'HH:mm'
                    )}`}</p>
                </div>
            ) : (
                <div>-</div>
            )}
        </td>
    )
}

export default EventCard;