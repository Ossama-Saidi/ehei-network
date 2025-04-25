import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // Make sure you have a Checkbox component


function SloganSection({ userCache }: { userCache: any }) {
    const [randomSlogans, setRandomSlogans] = useState(false);
    const slogans = [
        `Je te félicite chaleureusement, ${userCache?.prenom} 💬`,
        `C'est impressionnant ! Bravo 👏 de la part de ${userCache?.nomComplet}`,
        `Continue comme ça champion ✨ — signé ${userCache?.prenom}`,
        `Un grand bravo, ${userCache?.prenom} est fan 🔥`,
        `${userCache?.prenom} t'encourage depuis EHEI Connect 🌟`,
        `💡 De la part de ${userCache?.role === 'professeur' ? 'Professeur' : 'Étudiant'} ${userCache?.nomComplet}`,
        "You're doing amazing!",
        "Never stop growing!",
        "Success is near, keep going!",
        "Your effort matters!",
        "Today is your day!",
        "You're on the right path!",
        "Knowledge is your superpower!",
        "Make today count!"
    ];

//   const getRandomSlogans = () => {
//     const shuffled = [...slogans].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3);
//   };
//   // Only calculate displayedSlogans when rendering to avoid unnecessary calculations
//   const displayedSlogans = randomSlogans
//     ? getRandomSlogans()
//     : [
//         `Great job !`,
//         `Keep it up, !`,
//         `Proud of you, !`
//       ];

  return (
    <>
      {/* <div className="flex items-center space-x-2 mt-2"> */}
        <Checkbox
          id="randomSlogans"
          checked={randomSlogans}
          onCheckedChange={(checked) => {
            // Explicitly handle the possible values
            if (checked === true) {
              setRandomSlogans(true);
            } else {
              setRandomSlogans(false);
            }
          }}
        />
        <label htmlFor="randomSlogans" className="text-sm">
            Utilisez des slogans aléatoires
        </label>
      {/* </div> */}

      {userCache && (
        <div className="flex space-x-2 overflow-x-auto mt-2">
          {/* {displayedSlogans.map((text, index) => (
            <Button key={index} variant="outline" size="sm">
              {text}
            </Button>
          ))} */}
        </div>
      )}
    </>
  );
}

export default SloganSection;
