import { Navbar, Tab, Tabs } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';

import logoUrl from '/logo.svg?url';

import { DashboardPanel } from './components/DashboardPanel.jsx';
import { FilesPanel } from './components/FilesPanel.jsx';
import { SelectRange } from './header/SelectRange.jsx';
import { state } from './state/state.js';

const TABS = new Set(['dashboard', 'files']);

function isValidTab(value) {
  return TABS.has(value);
}

function getTabFromHash() {
  const hash = globalThis.location.hash.replace('#', '');
  return isValidTab(hash) ? hash : 'dashboard';
}

function App() {
  const [selectedTab, setSelectedTab] = useState(getTabFromHash);

  useEffect(() => {
    globalThis.location.hash = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    function onHashChange() {
      setSelectedTab(getTabFromHash());
    }
    globalThis.addEventListener('hashchange', onHashChange);
    return () => globalThis.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigateToFiles = useCallback((query) => {
    if (query !== undefined) {
      state.view.query.value = query;
    }
    setSelectedTab('files');
  }, []);

  return (
    <>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <img src={logoUrl} alt="ELN Importation Monitor" height={28} />
            <span style={{ fontWeight: 700, letterSpacing: -0.3 }}>
              ELN Importation Monitor
            </span>
          </Navbar.Heading>
          <Navbar.Divider />
          <Tabs
            selectedTabId={selectedTab}
            onChange={(tabId) => setSelectedTab(tabId)}
            size="large"
          >
            <Tab id="dashboard" title="Dashboard" />
            <Tab id="files" title="Files" />
          </Tabs>
        </Navbar.Group>
        <Navbar.Group align="right">
          <SelectRange />
        </Navbar.Group>
      </Navbar>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {selectedTab === 'dashboard' && (
          <DashboardPanel onNavigateToFiles={handleNavigateToFiles} />
        )}
        {selectedTab === 'files' && <FilesPanel />}
      </div>
    </>
  );
}

export default App;
