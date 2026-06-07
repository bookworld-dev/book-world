import MapLoader from './components/MapLoader';
import { getLocations } from '@/app/lib/services/location.service';

export default async function Home() {
  const locations = await getLocations(true);
  return <MapLoader activeLocations={locations} />;
}
