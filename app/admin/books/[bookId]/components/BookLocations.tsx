import { Location } from "@/app/lib/types";

type BookLocationsProps = {
  locations: Location[]
}

const BookLocations = ({locations}: BookLocationsProps) => {
  const displayLocation = (location: Location) => {
    return <li key={location.code}>{location.name} ({location.code})</li>
  }

  return (
    <div>
      <p>Locations:</p>
      {
        locations.map(displayLocation)
      }
    </div>
  )
}

export default BookLocations