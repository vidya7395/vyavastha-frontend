import { AppShell, Container } from '@mantine/core';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import CommonDrawer from '../common/CommonDrawer';
import AppHeader from './AppHeader';

const Body = () => {
  const drawers = useSelector((state) => state.drawer); // Get all drawers from the Redux state

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <Container size={'xl'}>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </Container>
      {Object.keys(drawers).map((drawerId) => (
        <CommonDrawer key={drawerId} drawerId={drawerId} />
      ))}
    </AppShell>
  );
};

export default Body;
