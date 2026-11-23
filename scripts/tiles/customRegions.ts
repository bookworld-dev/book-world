export type NaturalEarthProps = Record<string, unknown>;

export type CustomRegion = {
  code: string;
  name: string;
  includes: (props: NaturalEarthProps) => boolean;
  replacesParts?: boolean;
};

type RegionRow = [code: string, name: string, naturalEarthName?: string];

const ukNation = (code: string, name: string): CustomRegion => ({
  code,
  name,
  includes: props => props.iso_a2 === 'GB' && props.geonunit === name,
});

const regionsOf = (country: string, rows: RegionRow[]): CustomRegion[] =>
  rows.map(([code, name, naturalEarthName = name]) => ({
    code,
    name,
    includes: props => props.iso_a2 === country && String(props.region).trim() === naturalEarthName,
    replacesParts: true,
  }));

const macedonianRegion = (code: string, name: string, municipalities: string[]): CustomRegion => ({
  code,
  name,
  includes: props => props.iso_a2 === 'MK' && municipalities.includes(String(props.iso_3166_2)),
  replacesParts: true,
});

export const customRegions: CustomRegion[] = [
  ukNation('GB-ENG', 'England'),
  ukNation('GB-SCT', 'Scotland'),
  ukNation('GB-WLS', 'Wales'),
  ukNation('GB-NIR', 'Northern Ireland'),

  ...regionsOf('FR', [
    ['FR-ARA', 'Auvergne-Rhône-Alpes'],
    ['FR-BFC', 'Bourgogne-Franche-Comté'],
    ['FR-BRE', 'Bretagne'],
    ['FR-CVL', 'Centre-Val de Loire'],
    ['FR-20R', 'Corse'],
    ['FR-GES', 'Grand Est'],
    ['FR-HDF', 'Hauts-de-France'],
    ['FR-IDF', 'Île-de-France'],
    ['FR-NOR', 'Normandie'],
    ['FR-NAQ', 'Nouvelle-Aquitaine'],
    ['FR-OCC', 'Occitanie'],
    ['FR-PDL', 'Pays de la Loire'],
    ['FR-PAC', "Provence-Alpes-Côte d'Azur", "Provence-Alpes-Côte-d'Azur"],
  ]),

  ...regionsOf('ES', [
    ['ES-AN', 'Andalucía'],
    ['ES-AR', 'Aragón'],
    ['ES-AS', 'Asturias'],
    ['ES-CN', 'Canarias', 'Canary Is.'],
    ['ES-CB', 'Cantabria'],
    ['ES-CL', 'Castilla y León'],
    ['ES-CM', 'Castilla-La Mancha'],
    ['ES-CT', 'Cataluña'],
    ['ES-CE', 'Ceuta'],
    ['ES-EX', 'Extremadura'],
    ['ES-GA', 'Galicia'],
    ['ES-IB', 'Illes Balears', 'Islas Baleares'],
    ['ES-RI', 'La Rioja'],
    ['ES-MD', 'Madrid'],
    ['ES-ML', 'Melilla'],
    ['ES-MC', 'Murcia'],
    ['ES-NC', 'Navarra', 'Foral de Navarra'],
    ['ES-PV', 'País Vasco'],
    ['ES-VC', 'Comunitat Valenciana', 'Valenciana'],
  ]),

  ...regionsOf('IT', [
    ['IT-65', 'Abruzzo'],
    ['IT-77', 'Basilicata'],
    ['IT-78', 'Calabria'],
    ['IT-72', 'Campania'],
    ['IT-45', 'Emilia-Romagna'],
    ['IT-36', 'Friuli-Venezia Giulia'],
    ['IT-62', 'Lazio'],
    ['IT-42', 'Liguria'],
    ['IT-25', 'Lombardia'],
    ['IT-57', 'Marche'],
    ['IT-67', 'Molise'],
    ['IT-21', 'Piemonte'],
    ['IT-75', 'Puglia', 'Apulia'],
    ['IT-88', 'Sardegna'],
    ['IT-82', 'Sicilia', 'Sicily'],
    ['IT-52', 'Toscana'],
    ['IT-32', 'Trentino-Alto Adige'],
    ['IT-55', 'Umbria'],
    ['IT-23', "Valle d'Aosta"],
    ['IT-34', 'Veneto'],
  ]),

  macedonianRegion('MK-SK', 'Skopje Region', [
    'MK-01', 'MK-02', 'MK-09', 'MK-17', 'MK-29', 'MK-32', 'MK-34', 'MK-38', 'MK-39',
    'MK-68', 'MK-70', 'MK-74', 'MK-77', 'MK-79', 'MK-82', 'MK-84', 'MK-85',
  ]),
  macedonianRegion('MK-PE', 'Pelagonia Region', ['MK-04', 'MK-25', 'MK-27', 'MK-45', 'MK-46', 'MK-53', 'MK-55', 'MK-62', 'MK-66']),
  macedonianRegion('MK-PO', 'Polog Region', ['MK-06', 'MK-08', 'MK-16', 'MK-19', 'MK-30', 'MK-35', 'MK-50', 'MK-75', 'MK-76']),
  macedonianRegion('MK-VA', 'Vardar Region', ['MK-13', 'MK-20', 'MK-24', 'MK-36', 'MK-49', 'MK-54', 'MK-67', 'MK-69', 'MK-80']),
  macedonianRegion('MK-EA', 'Eastern Region', [
    'MK-03', 'MK-14', 'MK-23', 'MK-33', 'MK-37', 'MK-42', 'MK-51', 'MK-60', 'MK-63', 'MK-81', 'MK-83',
  ]),
  macedonianRegion('MK-NE', 'Northeastern Region', ['MK-43', 'MK-44', 'MK-47', 'MK-48', 'MK-65', 'MK-71']),
  macedonianRegion('MK-SE', 'Southeastern Region', [
    'MK-05', 'MK-07', 'MK-10', 'MK-11', 'MK-18', 'MK-26', 'MK-41', 'MK-56', 'MK-64', 'MK-73',
  ]),
  macedonianRegion('MK-SW', 'Southwestern Region', [
    'MK-12', 'MK-15', 'MK-21', 'MK-22', 'MK-28', 'MK-31', 'MK-40', 'MK-52', 'MK-57', 'MK-58', 'MK-61', 'MK-72', 'MK-78',
  ]),
];
