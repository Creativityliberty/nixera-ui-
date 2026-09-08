import experienceData from '@/data/experience.json';
import { ExperienceRenderer } from '@/components/ExperienceRenderer';
import { WebJSONDocument } from '@/types/webjson';

export default function HomePage() {
  return <ExperienceRenderer data={experienceData as WebJSONDocument} />;
}
