import CardBox from "./CardBox";
import { cardData } from "./cardData";

export default function CardsArranged() {
  const {Dance,Singing,HE
  } = cardData;

  return (
    <div className="bg-gray-100 pt-6 md:pt-8 lg:pt-10">
      <div className="bg-gradient-to-b from-teal-400 to-teal-300 h-32 sm:h-40 md:h-48 lg:h-56 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200')",
          }}
        />
      </div>

      <div className="md:max-w-[800px] lg:max-w-[1200px] mx-auto px-1 sm:px-3 -mt-24 relative z-10">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          <CardBox
            title="Dances"
            items={Dance}
            footerLink="#"
            footerText="Discover more"
          />

          <CardBox
            title="Songs"
            items={Singing}
            footerLink="#"
            footerText="Shop all gifts"
          />

          <CardBox
            title="Instruments"
            items={HE}
            footerLink="#"
            footerText="Discover more"
          />
        </div>
      </div>
    </div>
  );
}
