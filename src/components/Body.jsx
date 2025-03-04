import { AppShell, Avatar, Container, Flex, Menu } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import CommonDrawer from '../common/CommonDrawer';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawers = useSelector((state) => state.drawer); // Get all drawers from the Redux state
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Flex
          style={{ margin: '10px 30px' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'space-between' }}
          align={'center'}
          space={'md'}
        >
          <div>Expense Tracker</div>

          <Menu width={200} shadow="md">
            <Menu.Target>
              <Avatar
                style={{ cursor: 'pointer' }}
                variant="filled"
                radius="lg"
                src=""
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => handleLogout()}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
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
