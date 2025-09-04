import HeatMapD3 from './HeatMap';

export default function HeatSkillMap() {
  return (
    <section className="py-10">
      <div className="container lg:max-w-[90%] mx-auto px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl text-center 2xl:text-5xl font-semibold text-[#1F514C]">
          In-Demand Heat Skills Map
        </h2>

        <div className="mt-6">
          <div className="relative w-full h-auto">
            <HeatMapD3 />
          </div>
        </div>
      </div>
    </section>
  );
}
