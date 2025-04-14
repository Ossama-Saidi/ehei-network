'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPinHouse, Building, BriefcaseBusiness, BrainCircuit, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"

function SearchPopover({ icon: Icon, placeholder, fetchUrl, onSelect }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; placeholder: string; fetchUrl: string; onSelect: (value: any) => void }) {
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [popoverOpen, setPopoverOpen] = useState(false); // Control the popover state

    const filteredOptions = options.filter((option: string) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelection = (option: any) => {
        onSelect(option); // Send selected value to CreatePublication
        setPopoverOpen(false); // Close the Popover
    };
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
                }
                const data = await response.json();

                // Choisir dynamiquement le champ approprié en fonction de l'icône
                const key = fetchUrl.includes('emojis')
                    ? 'unicode'
                    : fetchUrl.includes('cities')
                    ? 'nom'
                    : fetchUrl.includes('companies')
                    ? 'nom'
                    : fetchUrl.includes('technologies')
                    ? 'nom'
                    : 'type'; // Par défaut pour les emplois

                setOptions(data.map((item: Record<string, string>) => item[key]));

            } catch (error) {
                console.error(`Erreur lors de la récupération des données depuis ${fetchUrl}`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchUrl]);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-50">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
                {isLoading ? (
                    <p className="mt-2 text-center text-sm text-gray-500">Chargement...</p>
                ) : (
                    <ul className="mt-2 space-y-1">
                        <ScrollArea className="h-[200px] w-[200px] rounded-md border p-2">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li 
                                    key={index} 
                                    className="text-sm cursor-pointer p-2 hover:bg-gray-100"
                                    onClick={() => handleSelection(option)}
                                >
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className="text-center text-sm text-gray-500">
                                Aucun résultat trouvé
                            </li>
                        )}
                        </ScrollArea>
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    );
}

// export function EmojiButton() {
//     return <SearchPopover icon={Smile} placeholder="Rechercher un emoji..." fetchUrl="http://localhost:3003/api/publications/emojis" />;
// }

export function CityButton({ onSelect }: any) {
    return <SearchPopover icon={MapPinHouse} placeholder="Rechercher une ville..." fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/publications/cities`} onSelect={onSelect}/>;
}

export function CompanyButton({ onSelect }: any) {
    return <SearchPopover icon={Building} placeholder="Rechercher une entreprise..." fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/publications/companies`} onSelect={onSelect}/>;
}

export function EmploiButton({ onSelect }: any) {
    return <SearchPopover icon={BriefcaseBusiness } placeholder="Rechercher un emploi..." fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/publications/emplois`} onSelect={onSelect}/>;
}
export function TechButton({ onSelect }: any) {
    return <SearchPopover icon={BrainCircuit} placeholder="Rechercher une technologie..." fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/publications/technologies`} onSelect={onSelect}/>;
}

export function ClubButton({ onSelect }: any) {
    return <SearchPopover icon={Users} placeholder="Rechercher une technologie..." fetchUrl="http://localhost:3003/api/publications/technologies" onSelect={onSelect}/>;
}