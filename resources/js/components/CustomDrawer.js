import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const CustomDrawer = withStyles({
    paper: {
        backgroundColor: 'rgba(60,80,90,0.9)',
        width: 450,
        maxWidth: '95vw',
        overflow: "hidden",
        flexGrow: 1,
    },
})(Drawer)

export default CustomDrawer;