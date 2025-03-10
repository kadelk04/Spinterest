import { Layout, Layouts } from 'react-grid-layout';
import { Widget } from '../data/playlistUtils';

export const getLayouts = (widgets: Widget[]): Layouts => {
  const generateLayout = (breakpoint: string, cols: number): Layout[] => {
    return widgets.map((item, index) => ({
      i: item.id,
      x: index % cols,
      y: Math.floor(index / cols) * 2,
      w: 1,
      h: 1,
    }));
  };

  return {
    lg: generateLayout('lg', 6),
    md: generateLayout('md', 4),
    sm: generateLayout('sm', 3),
    xs: generateLayout('xs', 2),
    xxs: generateLayout('xxs', 2),
  };
};
