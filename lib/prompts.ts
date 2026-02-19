import marketingSkills from '../prompts/marketing.json';

export interface Skill {
  id: string;
  name: string;
  prompt: string;
}

export const corePrompt = marketingSkills.core;
export const availableSkills: Skill[] = marketingSkills.skills;

export function getFullPrompt(selectedSkillIds: string[]): string {
  const selected = availableSkills.filter(skill => selectedSkillIds.includes(skill.id));
  
  if (selected.length > 0) {
    return `${corePrompt}\n\n${selected.map(s => s.prompt).join('\n')}`;
  }
  
  return `${corePrompt}\nDefault: Just make it sell.`;
}
