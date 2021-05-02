import React, { ReactNode } from 'react';
import Meta from './Meta';
import Timing from './Timing';
import Track from './Track';
import TrackTools from './Track/Tools';
import Settings from './Settings';

interface TabInfo {
  name: string;
  main: ReactNode;
  tools?: ReactNode;
  prop?: ReactNode;
}

export enum TabKeys {
  meta,
  timing,
  track,
  settings,
}

const tabs: Record<TabKeys, TabInfo> = {
  [TabKeys.meta]: {
    name: 'Meta',
    main: <Meta />,
  },
  [TabKeys.timing]: {
    name: 'Timing',
    main: <Timing />,
  },
  [TabKeys.track]: {
    name: 'Track',
    main: <Track />,
    tools: <TrackTools />,
  },
  [TabKeys.settings]: {
    name: 'Settings',
    main: <Settings />,
  },
};

export default tabs;
