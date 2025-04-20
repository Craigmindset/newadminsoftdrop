declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions)
      fitBounds(bounds: LatLngBounds, padding?: number | Padding): void
      getBounds(): LatLngBounds
      getCenter(): LatLng
      getDiv(): Element
      getZoom(): number
      panTo(latLng: LatLng | LatLngLiteral): void
      setCenter(latLng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
      toString(): string
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng)
      extend(point: LatLng | LatLngLiteral): LatLngBounds
      getCenter(): LatLng
      getNorthEast(): LatLng
      getSouthWest(): LatLng
      isEmpty(): boolean
      toJSON(): LatLngBoundsLiteral
      toString(): string
      toUrlValue(precision?: number): string
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    interface LatLngBoundsLiteral {
      east: number
      north: number
      south: number
      west: number
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      clickableIcons?: boolean
      disableDefaultUI?: boolean
      disableDoubleClickZoom?: boolean
      draggable?: boolean
      draggableCursor?: string
      fullscreenControl?: boolean
      gestureHandling?: string
      heading?: number
      keyboardShortcuts?: boolean
      mapTypeControl?: boolean
      mapTypeId?: string
      maxZoom?: number
      minZoom?: number
      noClear?: boolean
      panControl?: boolean
      rotateControl?: boolean
      scaleControl?: boolean
      scrollwheel?: boolean
      streetViewControl?: boolean
      styles?: any[]
      tilt?: number
      zoom?: number
      zoomControl?: boolean
    }

    interface Padding {
      bottom: number
      left: number
      right: number
      top: number
    }

    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener
        getBounds(): LatLngBounds
        getPlace(): PlaceResult
        setBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void
        setComponentRestrictions(restrictions: ComponentRestrictions): void
        setFields(fields: string[]): void
        setOptions(options: AutocompleteOptions): void
        setTypes(types: string[]): void
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds | LatLngBoundsLiteral
        componentRestrictions?: ComponentRestrictions
        fields?: string[]
        placeIdOnly?: boolean
        strictBounds?: boolean
        types?: string[]
      }

      interface ComponentRestrictions {
        country: string | string[]
      }

      interface PlaceResult {
        address_components?: AddressComponent[]
        adr_address?: string
        aspects?: PlaceAspectRating[]
        business_status?: string
        formatted_address?: string
        formatted_phone_number?: string
        geometry?: PlaceGeometry
        html_attributions?: string[]
        icon?: string
        international_phone_number?: string
        name?: string
        opening_hours?: OpeningHours
        photos?: PlacePhoto[]
        place_id?: string
        plus_code?: PlusCode
        price_level?: number
        rating?: number
        reviews?: PlaceReview[]
        types?: string[]
        url?: string
        user_ratings_total?: number
        utc_offset?: number
        vicinity?: string
        website?: string
      }

      interface AddressComponent {
        long_name: string
        short_name: string
        types: string[]
      }

      interface PlaceAspectRating {
        rating: number
        type: string
      }

      interface PlaceGeometry {
        location: LatLng
        viewport: LatLngBounds
      }

      interface OpeningHours {
        isOpen(date?: Date): boolean
        periods: OpeningPeriod[]
        weekday_text: string[]
      }

      interface OpeningPeriod {
        close: OpeningHoursTime
        open: OpeningHoursTime
      }

      interface OpeningHoursTime {
        day: number
        hours: number
        minutes: number
        nextDate: number
        time: string
      }

      interface PlacePhoto {
        getUrl(opts: PhotoOptions): string
        height: number
        html_attributions: string[]
        width: number
      }

      interface PhotoOptions {
        maxHeight?: number
        maxWidth?: number
      }

      interface PlusCode {
        compound_code: string
        global_code: string
      }

      interface PlaceReview {
        author_name: string
        author_url: string
        language: string
        profile_photo_url: string
        rating: number
        relative_time_description: string
        text: string
        time: number
      }
    }

    interface MapsEventListener {
      remove(): void
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener
      function addDomListener(instance: any, eventName: string, handler: Function, capture?: boolean): MapsEventListener
      function clearInstanceListeners(instance: any): void
    }
  }
}
