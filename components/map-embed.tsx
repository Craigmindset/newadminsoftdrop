import { getMapEmbedUrl } from "@/app/actions/maps"

interface MapEmbedProps {
  lat: number
  lng: number
  zoom?: number
}

export default async function MapEmbed({ lat, lng, zoom = 17 }: MapEmbedProps) {
  // Get the map URL from the server action
  const mapUrl = await getMapEmbedUrl(lat, lng, zoom)

  return <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} src={mapUrl} allowFullScreen></iframe>
}
