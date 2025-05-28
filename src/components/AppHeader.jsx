import {
  Flex,
  Image,
  Group,
  ActionIcon,
  Menu,
  Avatar,
  Loader
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGetUserQuery, useLogoutMutation } from '../services/authApi';
import { MENU_LINKS } from '../utils/menuLinks';
import AppLogo from '../assets/app-logo.svg'; // Adjust the path

const AppHeader = () => {
  const navigate = useNavigate();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const { data: user, isLoading: loadingUserDetail } = useGetUserQuery();
  console.log('user', user);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Redirect to login or home
      window.location.href = '/'; // Use this if you want to redirect to a specific URL
      navigate('/'); // Use this if you want to use react-router for navigation
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      direction={{ base: 'column', sm: 'row' }}
      gap="sm"
      px="xl"
      py="md"
    >
      {/* Logo + Nav */}
      <Group>
        <Image src={AppLogo} alt="App Logo" width={24} height={24} />

        <Group ml="lg" gap="lg">
          {MENU_LINKS.map((menu) => (
            <NavLink
              key={menu.link}
              to={menu.link}
              className={({ isActive }) =>
                isActive ? 'menu-link active-menu-link' : 'menu-link'
              }
            >
              {menu.label}
            </NavLink>
          ))}
        </Group>
      </Group>

      {/* Settings + Profile Menu */}
      <Group gap="xs">
        <ActionIcon variant="light" color="gray" size="lg">
          <IconSettings size={18} />
        </ActionIcon>

        <Menu width={200} shadow="md" position="bottom-end">
          <Menu.Target>
            <Avatar
              variant="filled"
              color="yellow"
              radius="md"
              size="md"
              style={{ cursor: 'pointer' }}
            >
              {loadingUserDetail ? (
                <Loader size="xs" />
              ) : (
                user?.user?.name.charAt(0).toUpperCase()
              )}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleLogout}>
              {logoutLoading ? <Loader size="xs" /> : 'Logout'}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};

export default AppHeader;
