import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Earth } from 'lucide-react';
import { SetStateAction, useState } from 'react';

const PrivacySelector: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {
    const [privacy, setPrivacy] = useState("Public");

    const handlePrivacyChange = (value: string) => {
        setPrivacy(value);
        onChange(value); // Envoyer la valeur sélectionnée
    };


    return (
        <div className="flex items-center gap-2 border rounded-lg p-1">
            <Earth className="h-5 w-5 text-gray-500" />
            <Select value={privacy} onValueChange={handlePrivacyChange}>
                <SelectTrigger className="text-sm p-1 border-none focus:ring-0">
                    <SelectValue placeholder="Public" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="Only-me">Only-me</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default PrivacySelector;
