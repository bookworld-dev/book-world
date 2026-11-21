export type NaturalEarthProps = Record<string, unknown>;

export type CustomRegion = {
  code: string;
  name: string;
  includes: (props: NaturalEarthProps) => boolean;
};

const ukNation = (code: string, name: string): CustomRegion => ({
  code,
  name,
  includes: props => props.iso_a2 === 'GB' && props.geonunit === name,
});

export const customRegions: CustomRegion[] = [
  ukNation('GB-ENG', 'England'),
  ukNation('GB-SCT', 'Scotland'),
  ukNation('GB-WLS', 'Wales'),
  ukNation('GB-NIR', 'Northern Ireland'),
];
