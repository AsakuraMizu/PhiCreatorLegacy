import React from 'react';
import { useElectron } from '/@/use/electron';

const App: React.FC = () => {
  const api = useElectron();

  return (
    <ul>
      {Object.entries(api.versions).map(([lib, version]) => (
        <li key={lib}>
          <strong>{lib}</strong>: v{version}
        </li>
      ))}
    </ul>
  );
};

export default App;
