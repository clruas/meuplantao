export type ISODateString = string;

export enum ServiceType {
  Normal = 'normal',
  Swap = 'swap',
  Coverage = 'coverage'
}

export enum ServicePeriod {
  Day = 'day',
  Night = 'night'
}

export enum ServiceStatus {
  Scheduled = 'scheduled',
  Completed = 'completed',
  Absence = 'absence',
  Hospital = 'hospital',
  Pause = 'pause'
}

export enum ViewMode {
  Month = 'month',
  Week = 'week',
}