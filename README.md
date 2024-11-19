# 專案說明

## 啟動專案

```
npm run dev
```

## 技術選型

- 基礎建設：React、TypeScript、Vite，並設置 path alias
- DnD 拖曳功能套件： DnD Kit，為近年順手好用的 DnD 套件（react-beautiful-dnd 已不再維護）
- WYSIWYG Rich Editor 套件：react-quill
- CSS：tailwind
- ESLint：Airbnb 並整合 Prettier

## 專案架構

在現階段，用 features 資料夾以 co-location 概念，以功能模組拆分資料夾結構，將相關檔案聚集在一起，能夠提供較好的擴展性與維護性

由於這次有加入 Rich Editor，故把編輯模式的功能做在右側內容元件較為合適


```
.
└── /src
    ├── /components
    ├── /hooks
    └── /features
        ├── /otherFeatures
        └── /contentEditor
            ├── /components
            │   ├── /ContentEditor // 主要編輯器整合
            │   ├── /DnD // 拖曳相關元件
            │   ├── /CarouselPreviewEditor // 幻燈片元件
            │   ├── /ImagePreviewEditor // 圖片內容元件（包含編輯模式）
            │   └── /TextPreviewEditor // Rich Text 內容元件（包含編輯模式）
            ├── /pages
            ├── types.ts
            ├── constants.ts
            ├── data.ts
            └── utils.ts
```

## 功能說明

- 將內容元件從左側拖曳右側，即可新增
- 圖片與文字元件，可雙擊開啟編輯模式，點擊元件外區塊，即可退出編輯模式
- 每個元件 hover 過後，會出現刪除鍵，可進行刪除