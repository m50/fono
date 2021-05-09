/// <reference path="../../../gramophone/src/@types/KnexExtensions.d.ts" />

declare module 'remark-slug';

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
}

declare module '*.module.css' {
  const styles: Record<string, string>;

  export default styles;
}

declare module 'setup/db' {
  const db: import('knex').Knex;
  export default db;
}
