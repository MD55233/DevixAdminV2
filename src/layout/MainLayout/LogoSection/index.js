import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase, Typography, Box } from '@mui/material';

// project imports
import config from 'config';
import likostarlogo from 'assets/images/Devixberry.png'; // Adjust the path to where your SVG file is located
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();

  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Box sx={{ mt: 1, mr: 0.5 }}>
        {' '}
        {/* Add top margin to logo and reduce right margin */}
        
      </Box>
      <Box sx={{ display: 'flex' }}>
      <img src={likostarlogo} alt="Logo" width="32" height="32" />
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Museo Sans',
            fontWeight: 700,
            fontSize: 18,
            ml: 1,
            mt:0.5,
            color: 'secondary.main'
          }}
        >
          Devix
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Museo Sans',
            fontWeight: 300,
            fontSize: 18,
            color: '#2CB693',
            ml: 0,
            mr: 3,
            mt: 0.5
          }}
        >
         Seller
        </Typography>
      </Box>
    </ButtonBase>
  );
};

export default LogoSection;
