export type StoryChapter = {
  year: number
  title: string
  paragraphs: [string, ...string[]]
  imageSlotCount: 3 | 4 | 5
}
