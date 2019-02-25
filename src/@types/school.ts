export interface School {
    "fullName": string;
    "timeZone": string;
    "schedules": Schedule[]
}

export interface Schedule {
    "name": string;
    "days": number[];
    "classes": Period[];
}

export interface Period {
    name: string[];
    startTime: Time;
    endTime: Time;
}

export interface Time {
    hours: number;
    minutes: number;
}