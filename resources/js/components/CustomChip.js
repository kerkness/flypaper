import { withStyles } from '@material-ui/core/styles';
import { Chip } from "@material-ui/core";

const CssChip = withStyles({
    root: {
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: 'rgba(40,40,40,0.5)',
        '&:hover': {
            backgroundColor: 'rgba(50,50,50,0.75)',
        },
        '& .MuiChip-avatar': {
            color: '#FFFFFF',
            fontSize: 14,
        }
    },
    label: {
        color: '#EEEEEE',
        paddingLeft: 16,
        fontSize: 14,
    },
    avatar: {
        backgroundColor: 'rgba(10,10,10,0.75)',
    },
})(Chip);

export default CssChip;