export interface Thought {
  url: string;
  author: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export const thoughtsData: Thought[] = [
  {
    url: "https://www.linkedin.com/posts/dm-divyamahajan_tedaisf25-soulbits-soulbits-activity-7387335352866332672-QQ72",
    author: "Divya Mahajan",
    title: "TED AI SF '25 Experience",
    description: "Sharing insights from TED AI SF '25 and our journey with #SoulBits",
    date: "2025-01",
    tags: ["AI", "Conference", "TED"]
  },
  {
    url: "https://www.linkedin.com/posts/guptaachin_soulbits-soulbits-soulbits-activity-7386492700042141697-BZxC",
    author: "Achin Gupta",
    title: "Building with Purpose",
    description: "Reflections on building meaningful tech solutions with #SoulBits",
    date: "2025-01",
    tags: ["Tech", "Innovation", "SoulBits"]
  }
];
