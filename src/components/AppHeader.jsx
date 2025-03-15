import { Flex, Image, Group, ActionIcon, Menu, Avatar } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import AppLogo from '../assets/app-logo.svg'; // Adjust the path as necessary
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { MENU_LINKS } from '../utils/menuLinks';

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Flex
      style={{ margin: '10px 30px' }}
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'space-between' }}
      align={'center'}
      space={'md'}
    >
      <Group>
        <Image src={AppLogo} alt="App Logo" width={24} height={24} />
        <Group ml={'lg'} gap={'lg'}>
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

      <Group>
        <ActionIcon variant="light" color="gray" size={'lg'}>
          <IconSettings size={'18px'} />
        </ActionIcon>
        <Menu width={200} shadow="md">
          <Menu.Target>
            <Avatar
              style={{ cursor: 'pointer' }}
              variant="filled"
              color="yellow"
              radius={'md'}
              size={'md'}
            >
              {' '}
              JC{' '}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => handleLogout()}>Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Flex>
  );
};

export default AppHeader;
