import { Briefcase, Home, Lightbulb, Dumbbell, BookOpen, Heart, Zap, Target, FileText } from 'lucide-react';

export const categories = [
  {
    id: 1,
    name: 'Work',
    icon: Briefcase,
    color: 'from-indigo-500 to-indigo-700',
    lightColor: 'from-indigo-50 to-indigo-100',
    description: 'Professional tasks and projects',
  },
  {
    id: 2,
    name: 'Personal',
    icon: Home,
    color: 'from-rose-500 to-rose-700',
    lightColor: 'from-rose-50 to-rose-100',
    description: 'Personal life and activities',
  },
  {
    id: 3,
    name: 'Ideas',
    icon: Lightbulb,
    color: 'from-purple-500 to-purple-700',
    lightColor: 'from-purple-50 to-purple-100',
    description: 'Creative thoughts and brainstorming',
  },
  {
    id: 4,
    name: 'Health',
    icon: Dumbbell,
    color: 'from-pink-500 to-pink-700',
    lightColor: 'from-pink-50 to-pink-100',
    description: 'Health and wellness activities',
  },
  {
    id: 5,
    name: 'Learning',
    icon: BookOpen,
    color: 'from-emerald-500 to-emerald-700',
    lightColor: 'from-emerald-50 to-emerald-100',
    description: 'Education and skill development',
  },
  {
    id: 6,
    name: 'Goals',
    icon: Target,
    color: 'from-amber-500 to-amber-700',
    lightColor: 'from-amber-50 to-amber-100',
    description: 'Long-term objectives and milestones',
  },
  {
    id: 7,
    name: 'Quick',
    icon: Zap,
    color: 'from-sky-500 to-sky-700',
    lightColor: 'from-sky-50 to-sky-100',
    description: 'Quick tasks and reminders',
  },
];

export const noteCategories = [
  'Personal',
  'Work',
  'Ideas',
  'Journal',
  'Learning',
  'Research',
  'Meeting Notes',
  'Quick Notes',
];

export const noteColors = [
  { name: 'Default', value: 'default', preview: 'bg-gray-100 dark:bg-gray-800' },
  { name: 'Yellow', value: 'yellow', preview: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { name: 'Green', value: 'green', preview: 'bg-green-100 dark:bg-green-900/20' },
  { name: 'Blue', value: 'blue', preview: 'bg-blue-100 dark:bg-blue-900/20' },
  { name: 'Purple', value: 'purple', preview: 'bg-purple-100 dark:bg-purple-900/20' },
  { name: 'Pink', value: 'pink', preview: 'bg-pink-100 dark:bg-pink-900/20' },
  { name: 'Wine', value: 'wine', preview: 'bg-rose-100 dark:bg-rose-900/20' },
  { name: 'Cyan', value: 'cyan', preview: 'bg-cyan-100 dark:bg-cyan-900/20' },
];
