import { FC } from 'react';

declare module 'lucide-react' {
  interface IconProps {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
    style?: any;
    'aria-hidden'?: boolean;
    [key: string]: any;
  }
  
  type IconComponent = FC<IconProps>;
  
  export const Send: IconComponent;
  export const Mail: IconComponent;
  export const Phone: IconComponent;
  export const MapPin: IconComponent;
  export const CheckCircle: IconComponent;
  export const AlertCircle: IconComponent;
  export const Heart: IconComponent;
  export const Star: IconComponent;
  export const ThumbsUp: IconComponent;
  export const Download: IconComponent;
  export const Globe: IconComponent;
  export const Code: IconComponent;
  export const Shield: IconComponent;
  export const Lock: IconComponent;
  export const Eye: IconComponent;
  export const EyeOff: IconComponent;
  export const ChevronDown: IconComponent;
  export const ChevronRight: IconComponent;
  export const Menu: IconComponent;
  export const X: IconComponent;
  export const Plus: IconComponent;
  export const Minus: IconComponent;
  export const Copy: IconComponent;
  export const Check: IconComponent;
  export const ExternalLink: IconComponent;
  export const ArrowRight: IconComponent;
  export const ArrowLeft: IconComponent;
  export const Search: IconComponent;
  export const Settings: IconComponent;
  export const Home: IconComponent;
  export const User: IconComponent;
  
  [key: string]: IconComponent | any;
}
