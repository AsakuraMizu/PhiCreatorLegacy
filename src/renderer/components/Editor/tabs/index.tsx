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

export enum Tabs {
  meta,
  timing,
  track,
  settings,
}

const tabs: Record<Tabs, TabInfo> = {
  [Tabs.meta]: {
    name: 'Meta',
    main: <Meta />,
  },
  [Tabs.timing]: {
    name: 'Timing',
    main: <Timing />,
  },
  [Tabs.track]: {
    name: 'Track',
    main: <Track />,
    tools: <TrackTools />,
  },
  [Tabs.settings]: {
    name: 'Settings',
    main: <Settings />,
  },
};

export default tabs;
