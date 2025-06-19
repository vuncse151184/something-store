declare module 'simplebar-react' {
  import { ComponentType, HTMLAttributes } from 'react';
  
  interface SimpleBarProps extends HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    options?: any;
    scrollableNodeProps?: HTMLAttributes<HTMLDivElement>;
    autoHide?: boolean;
  }
  
  const SimpleBar: ComponentType<SimpleBarProps>;
  export default SimpleBar;
}