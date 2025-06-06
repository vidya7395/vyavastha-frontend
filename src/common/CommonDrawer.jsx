import { Drawer } from '@mantine/core';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer } from '../store/drawerSlice';
import AddTransactionParent from '../components/AddTransactionParent';

const CommonDrawer = ({ drawerId }) => {
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.drawer[drawerId]);
  const drawerSize = useSelector((state) => state.drawer[drawerId]?.size);

  if (!drawer) return null; // If no drawer exists, don't render

  const handleClose = () => {
    dispatch(closeDrawer({ id: drawerId })); // Close the drawer by dispatching the action
  };

  // Dynamic content based on drawer's contentType
  const renderContent = () => {
    switch (drawer.contentType) {
      case 'AddTransaction':
        return <AddTransactionParent drawerId={drawerId} />;

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
      size={drawerSize || 'lg'} // Default to 'lg' if size is not set
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
