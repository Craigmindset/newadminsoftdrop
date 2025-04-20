// Type definitions for the Contact Picker API
// https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API

interface ContactsManager {
  getProperties(): Promise<string[]>
  select(properties: string[], options?: ContactPickerOptions): Promise<ContactInfo[]>
  supportedProperties: string[]
}

interface ContactPickerOptions {
  multiple?: boolean
}

interface ContactInfo {
  address?: string[]
  email?: string[]
  icon?: Blob[]
  name?: string[]
  tel?: string[]
}

interface Navigator {
  contacts?: ContactsManager
}
