import { Input } from "@/shared/components/ui/input";
import { useEffect, useRef, useState } from "react";

type ContractSearchProps<T> = {
    items: T[];
    name: string;
    getLabel: (item: T) => string;
    onSelect: (item: T | null) => void;
    getValue: (item: T) => string | number; 
    placeholder?: string;
};

export function ContractSearch<T>({items, name, getLabel, onSelect, getValue, placeholder = "Pesquisar..."}: ContractSearchProps<T>) {
    const [search, setSearch] = useState("")
    const [selectedItem, setSelectedItem] = useState<T | null>(null)
    const searchRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const filteredItems = items.filter((item) =>
        getLabel(item).toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    function handleSearch(value: string) {
        setSearch(value);
        setSelectedItem(null);
        onSelect(null);
        setIsOpen(true);
    }

    function handleSelect(item: T) {
        setSelectedItem(item);
        setSearch(getLabel(item));
        onSelect(item);
        setIsOpen(false);
    }

    return (
        <div ref={searchRef} className="relative w-full">
            <input
                type="hidden"
                name={name}
                placeholder={placeholder}
                value={selectedItem ? getValue(selectedItem) : ""}
            />

            <Input
                placeholder={placeholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[transparent] text-black placeholder:text-gray-600 p-1"
            />

            {isOpen && search.length > 0 && !selectedItem && (
                <div className="absolute z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-white shadow-md">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                        {getLabel(item)}
                    </button>
                    ))
                ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                    Nenhum resultado encontrado.
                    </p>
                )}
                </div>
            )}
        </div>
    );
}