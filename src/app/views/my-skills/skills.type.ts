export type TRelatedProjectItem = {
  title?: string;
  git?: string;
  link?: string | undefined;
};

export type TSkill = {
  type: string,
  img: string,
  percent: number,
  relatedProject?: TRelatedProjectItem[]
}