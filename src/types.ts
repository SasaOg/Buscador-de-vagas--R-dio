export interface KeywordItem {
  id: string;
  text: string;
  active: boolean;
}

export interface KeywordGroup {
  id: 'roles' | 'contexts' | 'exclusions' | 'locations';
  title: string;
  description: string;
  color: 'pink' | 'blue' | 'yellow' | 'green';
  items: KeywordItem[];
}

export type SourceCategory =
  | 'radios-sp'
  | 'podcasts'
  | 'cidades-sp'
  | 'estados'
  | 'universidades';

export type BrazilianState = 'SP' | 'RJ' | 'MG' | 'ES' | 'PR' | 'SC' | 'RS';

export interface HiddenSource {
  id: string;
  name: string;
  category: SourceCategory;
  state?: BrazilianState;
  city?: string;
  grupo?: string; // Grupo ou empresa (ex: Grupo Globo, Grupo Bandeirantes)
  linkVagas?: string; // Link oficial de vagas
  linkRecrutamento?: string; // Página de recrutamento do grupo (Vagas.com, Infojobs, Gupy)
  linkContato?: string; // Link oficial de contato
  linkedIn?: string; // URL direta do perfil/school no LinkedIn
  instagram?: string; // URL do perfil oficial no Instagram
  badge?: string;
  notes?: string;
  isCustom?: boolean;
  isUniversity?: boolean; // Se for instituição universitária
}

export type TimeframeFilter = '24h' | '7dias' | '30dias';

export interface SavedSearchPreset {
  id: string;
  title: string;
  createdAt: string;
  activeRoles: string[];
  activeContexts: string[];
  activeExclusions: string[];
  activeLocations: string[];
  timeframe: TimeframeFilter;
}

export type JobLibraryStatus = 'saved' | 'applied' | 'interview' | 'archived';

export interface LibraryJob {
  id: string;
  title: string;
  company: string;
  url: string;
  status: JobLibraryStatus;
  dateAdded: string;
  appliedDate?: string;
  notes?: string;
  contactPerson?: string;
}

export type MainAppTab = 'radar' | 'fontes' | 'biblioteca';
