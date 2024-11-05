import { Layout, Layouts } from 'react-grid-layout';
import { Widget } from '../pages/Dashboard';

export const getLayouts = (widgets: Widget[]): Layouts => {
  const generateLayout = (breakpoint: string, cols: number): Layout[] => {
    return widgets.map((item, index) => ({
      i: item.id,
      x: (index % cols) * (12 / cols),
      y: Math.floor(index / cols) * 2,
      w: 12 / cols,
      h: 2,
    }));
  };

  return {
    lg: generateLayout('lg', 6),
    md: generateLayout('md', 4),
    sm: generateLayout('sm', 2),
    xs: generateLayout('xs', 1),
    xxs: generateLayout('xxs', 1),
  };
};
