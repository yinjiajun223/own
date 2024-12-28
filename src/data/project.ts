export interface ProjectItem {
  id?: number; // 唯一标识符
  title: string;
  title_en?: string;
  description?: string;
  date?: string; //发布日期
  detail?: string; //详细页路径
  url?: string; //上线链接
  tags?: string[];
  cover?: string[];
}
export const projectItems: ProjectItem[] = [
  {
    title: "[示例] 3D 图标资产 - 情人节",
    title_en: "Valentine's Day 3D Assets",
    date: "2023-10-15",
    detail: "/detail/free-3d-valentines-assets/",
    url: "https://web.606design.art/landings/004-free-3d-valentines-assets/",
    cover: [
      "free-3d-valentines-assets/01.jpg",
      "free-3d-valentines-assets/02.jpg",
      "free-3d-valentines-assets/03.jpg",
      "free-3d-valentines-assets/04.jpg",
    ],
    tags: ["3D", "WEB", "ICON"],
  },
  {
    title: "[示例] 待办清单网页版",
    title_en: "Online Todo List",
    date: "2023-10-15",
    detail: "/detail/todo",
    url: "https://www.ricocc.com/todo/",
    cover: ["cover/cover-todo.jpg"],
    tags: ["WEB", "UI", "TODO"],
  },
  {
    title: "[示例] Tink 旅行生活日记",
    title_en: "AI Landing Page",
    date: "2023-10-15",
    url: "https://travellife.zeabur.app/",
    detail: "/detail/tinklife",
    cover: ["travel/01.jpg", "travel/02.jpg", "travel/03.jpg", "travel/04.jpg"],
    tags: ["WEB", "MOBILE"],
  },
];
