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
];
