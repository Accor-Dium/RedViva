type ComboboxItem = { label: string; value: string }

interface ComboboxProps {
    id: string
    name: string
    placeholder: string
    items: ComboboxItem[]
    value: string
    onSelect: (item: ComboboxItem) => void
}