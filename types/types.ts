export interface Event {
    id: number;
    title: string;
    description: string;
    date: string; // Das Datum im ISO-Format (z.B., "2024-01-01T12:00:00Z")
    dateEnd: string;
}