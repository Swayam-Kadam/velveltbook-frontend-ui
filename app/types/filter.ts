export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  icon: string;
  options: FilterOption[];
  defaultValue: string;
  searchable?: boolean;
}

export interface SuburbOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  label: string;
  icon?: string;
  active?: boolean;
  desktopOnly?: boolean;
}
