export type WeaponCategory = 'Aircraft' | 'Naval' | 'Ground' | 'Missile' | 'Cyber' | 'Space';
export type StatusType = 'operational' | 'maintenance' | 'inactive' | 'reserve';
export type ClassificationLevel = 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET';

export interface WeaponSystem {
  id: string;
  name: string;
  designation: string;
  category: WeaponCategory;
  country: string;
  countryCode: string;
  status: StatusType;
  quantity: number;
  location: [number, number]; // [lat, lng]
  locationName: string;
  manufacturer: string;
  yearIntroduced: number;
  lastMaintenance: string;
  nextMaintenance: string;
  classification: ClassificationLevel;
  description: string;
  specs: Record<string, string>;
  image?: string;
}

export interface MaintenanceRecord {
  id: string;
  weaponId: string;
  weaponName: string;
  date: string;
  type: 'Scheduled' | 'Emergency' | 'Upgrade' | 'Inspection';
  status: 'completed' | 'in-progress' | 'scheduled';
  technician: string;
  notes: string;
  duration: number; // hours
  cost: number;
}

export interface DashboardStats {
  totalSystems: number;
  operational: number;
  maintenance: number;
  inactive: number;
  reserve: number;
  countries: number;
  scheduledMaintenance: number;
}
