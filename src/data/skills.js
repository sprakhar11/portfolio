import { FaJava, FaGitAlt } from 'react-icons/fa';
import { SiKotlin, SiSpringboot, SiPostgresql, SiRedis } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { Lightbulb, Mic, Users, Zap, CalendarDays } from 'lucide-react';

export const skillsData = [
  {
    category: "Languages",
    icon: "Code2",
    items: [
      { name: "Java", Icon: FaJava, color: "text-orange-500" },
      { name: "Kotlin", Icon: SiKotlin, color: "text-purple-500" }
    ]
  },
  {
    category: "Tools & Frameworks",
    icon: "Wrench",
    items: [
      { name: "Spring Boot", Icon: SiSpringboot, color: "text-green-500" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "text-blue-400" },
      { name: "Redis", Icon: SiRedis, color: "text-red-500" },
      { name: "Git", Icon: FaGitAlt, color: "text-orange-600" },
      { name: "VS Code", Icon: VscVscode, color: "text-blue-500" }
    ]
  },
  {
    category: "Soft Skills",
    icon: "Users",
    items: [
      { name: "Problem Solving", Icon: Lightbulb, color: "text-yellow-400" },
      { name: "Leadership", Icon: Users, color: "text-primary" },
      { name: "Event Management", Icon: CalendarDays, color: "text-accent" },
      { name: "Public Speaking", Icon: Mic, color: "text-blue-300" },
      { name: "Quick Learning", Icon: Zap, color: "text-teal-400" }
    ]
  }
];
