import { RateByStars } from "./RateByStars.jsx";
import { RateBySelect } from "./RateBySelect.jsx";
import { RateByTextbox } from "./RateByTextbox.jsx";

export const ratingMethods = [
    { id: 'stars', label: 'Rate with Stars', component: RateByStars },
    { id: 'select', label: 'Rate with Dropdown', component: RateBySelect },
    { id: 'textbox', label: 'Rate with Textbox', component: RateByTextbox },
];

export function RateByFactory({ val, onSelected, type, isDisabled }) {
    const SelectedRating = ratingMethods.find(method => method.id === type);

    if(!SelectedRating) return null;
    
    return (
        <SelectedRating.component
            val={val} 
            onSelected={onSelected} 
            isDisabled={isDisabled}
        />
    );
}