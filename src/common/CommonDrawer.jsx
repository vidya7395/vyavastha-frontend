import { Drawer } from '@mantine/core';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../store/drawerSlice';
import AddTransaction from '../components/AddTransaction'; // Example component

const CommonDrawer = ({ drawerId }) => {
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.drawer[drawerId]);

  if (!drawer) return null; // If no drawer exists, don't render

  const handleClose = () => {
    dispatch(closeDrawer({ id: drawerId })); // Close the drawer by dispatching the action
  };

  // Dynamic content based on drawer's contentType
  const renderContent = () => {
    console.log('drawer', drawer);

    switch (drawer.contentType) {
      case 'AddTransaction':
        return <AddTransaction />;

      default:
        return <div>Loading...</div>; // Fallback if no matching content type
    }
  };

  return (
    <Drawer
      opened={drawer.isOpen}
      onClose={handleClose}
      title=""
      padding="xl"
      size="lg"
      position="right"
      withCloseButton={false}
    >
      {renderContent()}
    </Drawer>
  );
};

CommonDrawer.propTypes = {
  drawerId: PropTypes.string.isRequired
};

export default CommonDrawer;
