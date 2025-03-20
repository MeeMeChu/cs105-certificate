import FuzzyText from "@components/404";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <FuzzyText
        baseIntensity={0.2} 
        hoverIntensity={0.5} 
        enableHover={true}
      >
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.2} 
        hoverIntensity={0.5} 
        enableHover={true}
      >
        Not Found
      </FuzzyText>
    </div>
  );
}