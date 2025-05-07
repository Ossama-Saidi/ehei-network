'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function EmojiPopover({ fetchUrl, onSelect }) {
    const [emojiCategories, setEmojiCategories] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [popoverOpen, setPopoverOpen] = useState(false); // Control the popover state

    const handleEmojiSelection = (emoji: any) => {
        onSelect(emoji); // Send selected emoji to CreatePublication
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

                const groupedEmojis = data.reduce((acc: { [x: string]: any[]; }, item: { category: any; unicode: any; }) => {
                    const category = item.category;
                    acc[category] = acc[category] || [];
                    acc[category].push(item.unicode);
                    return acc;
                }, {});

                setEmojiCategories(groupedEmojis);
                setActiveCategory(Object.keys(groupedEmojis)[0]); // Par défaut, affiche la première catégorie
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
                    <Smile className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-72">
                {isLoading ? (
                    <p className="text-center text-sm text-gray-500">Chargement...</p>
                ) : (
                    <>
                        {/* Barre de catégories */}
                        <ScrollArea className="whitespace-nowrap w-full">
                            <div className="flex space-x-2 pb-2">
                                {Object.keys(emojiCategories).map((category) => (
                                    <Button
                                        key={category}
                                        variant={category === activeCategory ? "secondary" : "link"}
                                        size="sm"
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        {/* Liste d'emojis */}
                        <ScrollArea className="h-40 mt-4">
                            <div className="flex flex-wrap gap-2">
                                {emojiCategories[activeCategory]?.map((emoji, index) => (
                                    <span key={index} className="text-2xl cursor-pointer" onClick={() => handleEmojiSelection(emoji)}>
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                            <ScrollBar />
                        </ScrollArea>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}


export function EmojiButton({ onSelect }) {
    return <EmojiPopover 
    fetchUrl="http://localhost:3003/api/publications/emojis"
    onSelect={onSelect}/>;
}
